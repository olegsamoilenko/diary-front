import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";
import { useIAP, type PurchaseError, type Product } from "react-native-iap";
import { INAPP_SKUS, SUB_SKUS } from "@/constants/iap";
import { isSub, getAndroidOfferTokenFromProduct } from "@/utils";

type IapContextValue = {
  connected: boolean;
  loading: boolean;
  products: Product[]; // наш каталог
  buySubById: (sku: string) => Promise<void>;
  buyInappById: (sku: string) => Promise<void>;
  restore: () => Promise<void>;
};

const IapCtx = createContext<IapContextValue>({} as any);
export const useIap = () => useContext(IapCtx);

export const IapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    connected,
    fetchProducts,
    requestPurchase,
    currentPurchase,
    finishTransaction,
    getAvailablePurchases,
    getActiveSubscriptions,
  } = useIAP({
    onPurchaseError: (error: PurchaseError) => {
      if (error.code !== "E_USER_CANCELLED") {
        Alert.alert("Purchase failed", error.message);
      }
    },
  });

  const [catalog, setCatalog] = useState<Product[]>([]);

  const loadCatalogAndState = async () => {
    try {
      const list: Product[] = [];

      if (SUB_SKUS.length) {
        const subs =
          (await fetchProducts({ skus: SUB_SKUS, type: "subs" })) ?? [];
        console.log("subs", subs);
        console.log(
          "[IAP] subs fetched:",
          subs.map((p) => ({
            id: p.id,
            title: (p as any).title,
            hasOffers: !!(p as any).subscriptionOfferDetails,
          })),
        );
        list.push(...subs);
      }

      if (INAPP_SKUS.length) {
        const inapps =
          (await fetchProducts({ skus: INAPP_SKUS, type: "inapp" })) ?? [];
        console.log(
          "[IAP] inapps fetched:",
          inapps.map((p) => ({ id: p.id, title: (p as any).title })),
        );
        list.push(...inapps);
      }

      setCatalog(list);
      console.log("[IAP] catalog size:", list.length);

      await getAvailablePurchases();
      await getActiveSubscriptions();
    } catch (e) {
      console.warn("[IAP] loadCatalog error:", e);
    }
  };

  useEffect(() => {
    if (connected) loadCatalogAndState();
  }, [connected]);

  // 2) Завершуємо транзакції
  useEffect(() => {
    if (!currentPurchase) return;
    (async () => {
      try {
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
      } catch (e) {
        console.warn("finishTransaction failed", e);
      }
    })();
  }, [currentPurchase]);

  const buySubById = async (sku: string) => {
    const product = catalog.find((p) => p.id === sku);
    const offerToken =
      product && isSub(product)
        ? getAndroidOfferTokenFromProduct(product)
        : undefined;

    await requestPurchase({
      type: "subs",
      request: {
        ios: { sku },
        android: {
          skus: [sku],
          ...(offerToken ? { subscriptionOffers: [{ sku, offerToken }] } : {}),
        },
      },
    });
  };

  const buyInappById = async (sku: string) => {
    await requestPurchase({
      type: "inapp",
      request: { ios: { sku }, android: { skus: [sku] } },
    });
  };

  // const restore = async () => {
  //   await getAvailablePurchases();
  //   await getActiveSubscriptions();
  // };

  const value = useMemo<IapContextValue>(
    () => ({
      connected,
      loading: !connected,
      products: catalog,
      buySubById,
      buyInappById,
      restore: loadCatalogAndState,
    }),
    [connected, catalog],
  );

  return <IapCtx.Provider value={value}>{children}</IapCtx.Provider>;
};
