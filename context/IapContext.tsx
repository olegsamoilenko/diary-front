import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Platform } from "react-native";
import * as IAP from "react-native-iap";
import {
  useIAP,
  type PurchaseError,
  type Product,
  type Purchase,
} from "react-native-iap";
import { INAPP_SKUS, SUB_SKUS } from "@/constants/iap";
import { isSub, getAndroidOfferTokenFromProduct, apiRequest } from "@/utils";
import * as Application from "expo-application";

type VerifyResp = {
  planId: string;
  startAt?: string;
  expiresAt?: string;
  storeState: string;
  autoRenewing?: boolean;
};

type IapContextValue = {
  connected: boolean;
  loading: boolean;
  products: Product[];
  buySubById: (sku: string) => Promise<VerifyResp>;
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
  const [loading, setLoading] = useState(false);

  const pending = useRef<{
    resolve?: (v: VerifyResp) => void;
    reject?: (e: any) => void;
    sku?: string;
  }>({});

  const fetchWithRetry = async (
    args: Parameters<typeof IAP.fetchProducts>[0],
    tries = 3,
    delayMs = 400,
  ): Promise<Product[]> => {
    for (let i = 0; i < tries; i++) {
      const res = (await IAP.fetchProducts(args)) ?? [];
      if (res.length) return res;
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return [];
  };

  const loadCatalogAndState = async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const list: Product[] = [];

      if (SUB_SKUS.length) {
        const subs = SUB_SKUS.length
          ? await fetchWithRetry({ skus: SUB_SKUS, type: "subs" })
          : [];
        console.log("subs", subs);
        console.log(
          "[IAP] subs fetched:",
          subs.map((p) => ({
            id: p.id,
            title: (p as any).title,
            hasOffers: !!(p as any).subscriptionOfferDetailsAndroid,
          })),
        );
        list.push(...subs);
      }

      if (INAPP_SKUS.length) {
        const inapps = INAPP_SKUS.length
          ? await fetchWithRetry({ skus: INAPP_SKUS, type: "inapp" })
          : [];
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected) loadCatalogAndState();
  }, [connected]);

  useEffect(() => {
    if (!currentPurchase) return;
    (async () => {
      try {
        const payload = buildVerificationPayload(currentPurchase);
        const anyP = currentPurchase as any;
        console.log("IAP DEBUG", {
          packageNameAndroid: anyP.packageNameAndroid,
          productId: getProductId(currentPurchase),
          orderIdAndroid: anyP.orderIdAndroid,
          purchaseTokenAndroid: anyP.purchaseTokenAndroid,
          applicationId: Application.applicationId,
        });
        const { data } = await apiRequest<VerifyResp>({
          url: "/iap/verify",
          method: "POST",
          data: payload,
        });

        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });

        pending.current.resolve?.(data);
      } catch (e) {
        pending.current.reject?.(e);
      } finally {
        pending.current = {};
      }
    })();
  }, [currentPurchase]);

  const buySubById = async (sku: string) => {
    const product = catalog.find((p) => p.id === sku);
    const offerToken =
      product && isSub(product)
        ? getAndroidOfferTokenFromProduct(product)
        : undefined;

    const p = new Promise<VerifyResp>((resolve, reject) => {
      pending.current = { resolve, reject, sku };
    });

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
    return p;
  };

  const buyInappById = async (sku: string) => {
    await requestPurchase({
      type: "inapp",
      request: { ios: { sku }, android: { skus: [sku] } },
    });
  };

  const value = useMemo<IapContextValue>(
    () => ({
      connected,
      loading: loading || !connected,
      products: catalog,
      buySubById,
      buyInappById,
      restore: loadCatalogAndState,
    }),
    [connected, catalog, loading],
  );

  return <IapCtx.Provider value={value}>{children}</IapCtx.Provider>;
};

type PurchaseLike = Purchase & {
  productId?: string;
  products?: string[];
  productIds?: string[];
  productIdAndroid?: string;
  productIdIOS?: string;
  transactionIdIOS?: string;
  transactionReceiptIOS?: string;
  originalTransactionIdIOS?: string;
  originalTransactionIdentifierIOS?: string;
  purchaseTokenAndroid?: string;
  purchaseToken?: string;
  orderIdAndroid?: string;
  orderId?: string;
};

function getProductId(p: Purchase): string {
  const a = p as PurchaseLike;
  return (
    a.products?.[0] ??
    a.productId ??
    a.productIds?.[0] ??
    a.productIdAndroid ??
    a.productIdIOS ??
    ""
  );
}

function buildVerificationPayload(p: Purchase) {
  const anyP = p as any;
  const productId = getProductId(p);

  if (Platform.OS === "android") {
    return {
      platform: "android",
      packageName: anyP.packageNameAndroid,
      productId: getProductId(p),
      purchaseToken: anyP.purchaseTokenAndroid ?? anyP.purchaseToken,
      orderId: anyP.orderIdAndroid ?? anyP.orderId,
    };
  }

  return {
    platform: "ios",
    productId,
    transactionId: anyP.transactionIdIOS ?? anyP.transactionId,
    receipt: anyP.transactionReceiptIOS ?? anyP.transactionReceipt,
    originalTransactionId:
      anyP.originalTransactionIdIOS ?? anyP.originalTransactionIdentifierIOS,
  };
}
