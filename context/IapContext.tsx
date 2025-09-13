import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import {
  useIAP,
  type Purchase,
  type PurchaseError,
  type Product,
} from "react-native-iap";
import { INAPP_SKUS, SUB_SKUS } from "@/constants/iap";
import { isSub, getAndroidOfferTokenFromProduct } from "@/utils";

type IapContextValue = {
  connected: boolean;
  loading: boolean;
  products: Product[];
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
    products,
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

  useEffect(() => {
    if (!connected) return;

    fetchProducts({ skus: INAPP_SKUS, type: "inapp" });
    // Каталог підписок
    fetchProducts({ skus: SUB_SKUS, type: "subs" });

    getAvailablePurchases();
    getActiveSubscriptions();
  }, [connected, fetchProducts, getAvailablePurchases, getActiveSubscriptions]);

  useEffect(() => {
    if (!currentPurchase) return;
    (async () => {
      try {
        // TODO: Валідую на бекенді (purchaseToken/JWS) перед наданням доступу
        await finishTransaction({
          purchase: currentPurchase,
          isConsumable: false,
        });
      } catch (e) {
        console.warn("finishTransaction failed", e);
      }
    })();
  }, [currentPurchase, finishTransaction]);

  const buySubById = async (sku: string) => {
    const product = products.find((p) => p.id === sku);
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
      request: {
        ios: { sku },
        android: { skus: [sku] },
      },
    });
  };

  const restore = async () => {
    await getAvailablePurchases();
    await getActiveSubscriptions();
  };

  const value = useMemo<IapContextValue>(
    () => ({
      connected,
      loading: !connected,
      products,
      buySubById,
      buyInappById,
      restore,
    }),
    [connected, products],
  );

  return <IapCtx.Provider value={value}>{children}</IapCtx.Provider>;
};
