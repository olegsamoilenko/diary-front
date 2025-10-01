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
  type ProductSubscriptionAndroidOfferDetails,
  purchaseUpdatedListener,
  ErrorCode,
} from "react-native-iap";
import { SUB_SKUS, SUB_BASE } from "@/constants/iap";
import { apiRequest } from "@/utils";
import { EPlatform, Plan, Subscriptions } from "@/types";

type AndroidOffer = ProductSubscriptionAndroidOfferDetails;

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
  subscriptions: Product[];
  buyPlan: (
    basePlanId: "lite-m1" | "base-m1" | "pro-m1",
    opts?: { oldToken?: string; obfuscatedId?: string },
  ) => Promise<Plan>;
  restore: () => Promise<void>;
};

const IapCtx = createContext<IapContextValue>({} as any);
export const useIap = () => useContext(IapCtx);

let purchaseListenerSet = false;

export const IapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    connected,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
    getActiveSubscriptions,
  } = useIAP({
    onPurchaseError: (error: PurchaseError) => {
      const code: any = (error as any)?.code;
      const userCancelled =
        code === ErrorCode.UserCancelled ||
        code === "E_USER_CANCELLED" ||
        code === "UserCancelled" ||
        code === "userCancelled";
      if (!userCancelled) {
        Alert.alert("Purchase failed", error.message);
      }
    },
  });

  const inFlightByToken = useRef<Set<string>>(new Set());
  const handledTokens = useRef<Set<string>>(new Set());
  function extractToken(p: any) {
    return (
      p.purchaseTokenAndroid ??
      p.purchaseToken ??
      p.transactionIdIOS ??
      p.transactionId
    );
  }

  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const baseSub = catalog.find((p) => p.id === Subscriptions.NEMORY);

  function pickOfferToken(
    p: Product,
    opts: { basePlanId: string; preferTrial?: boolean; tag?: string },
  ) {
    if (
      !("subscriptionOfferDetailsAndroid" in p) ||
      !p.subscriptionOfferDetailsAndroid
    ) {
      return undefined;
    }

    const offers = (p.subscriptionOfferDetailsAndroid ?? []) as AndroidOffer[];
    let candidates = offers.filter(
      (o: AndroidOffer) => o.basePlanId === opts.basePlanId,
    );
    if (opts.tag)
      candidates = candidates.filter((o: AndroidOffer) =>
        (o.offerTags ?? []).includes(opts.tag as string),
      );
    if (opts.preferTrial) {
      const withTrial = candidates.find((o: AndroidOffer) =>
        (o.pricingPhases?.pricingPhaseList ?? []).some(
          (ph: any) => ph.recurrenceMode === 2 || ph.priceAmountMicros === "0",
        ),
      );
      if (withTrial) return withTrial.offerToken;
    }
    return candidates[0]?.offerToken;
  }

  const pending = useRef<{
    resolve?: (v: any) => void;
    reject?: (e: any) => void;
    sku?: string;
    basePlanId?: string;
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

  function isPurchasedAndroid(purchase: any) {
    const stringState = purchase?.purchaseState as string | undefined;
    if (stringState) return stringState === "purchased";

    const numericState = purchase?.purchaseStateAndroid as number | undefined;
    if (typeof numericState === "number") {
      return numericState === 1;
    }
    if (purchase?.transactionReceipt) return true;

    return false;
  }

  useEffect(() => {
    if (purchaseListenerSet) return;
    purchaseListenerSet = true;
    const sub = purchaseUpdatedListener(async (purchase) => {
      const token = extractToken(purchase);
      if (!token) return;

      if (Platform.OS === EPlatform.ANDROID && !isPurchasedAndroid(purchase)) {
        return;
      }

      if (handledTokens.current.has(token)) {
        console.log("[IAP] skip: token already handled", token);
        return;
      }

      if (inFlightByToken.current.has(token)) {
        console.log("[IAP] skip: verification in-flight", token);
        return;
      }
      inFlightByToken.current.add(token);

      try {
        const payload = buildVerificationPayload(purchase);
        const { data } = await apiRequest<VerifyResp>({
          url: "/iap/create-sub",
          method: "POST",
          data: payload,
        });
        await finishTransaction({ purchase, isConsumable: false });

        handledTokens.current.add(token);
        pending.current.resolve?.(data);
      } catch (e) {
        pending.current.reject?.(e);
      } finally {
        inFlightByToken.current.delete(token);
        setTimeout(() => handledTokens.current.delete(token), 5 * 60 * 1000);
        pending.current = {};
      }
    });

    return () => {
      sub.remove();
      purchaseListenerSet = false;
    };
  }, [finishTransaction]);

  const loadCatalogAndState = async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const list: Product[] = [];

      if (SUB_SKUS.length) {
        const subs = SUB_SKUS.length
          ? await fetchWithRetry({ skus: SUB_SKUS, type: "subs" })
          : [];

        list.push(...subs);
      }

      setCatalog(list);

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

  async function buyPlan(
    basePlanId: "lite-m1" | "base-m1" | "pro-m1",
    opts?: { oldToken?: string; obfuscatedId?: string },
  ): Promise<Plan> {
    const offerToken = pickOfferToken(baseSub as Product, {
      basePlanId,
      preferTrial: true,
    });
    if (!offerToken)
      throw new Error(`No offerToken for basePlanId=${basePlanId}`);

    const p = new Promise<Plan>((resolve, reject) => {
      pending.current = { resolve, reject, basePlanId };
    });

    await requestPurchase({
      type: "subs",
      request: {
        ios: { sku: SUB_BASE },
        android: {
          skus: [SUB_BASE],
          subscriptionOffers: [{ sku: SUB_BASE, offerToken }],
          obfuscatedAccountIdAndroid: opts?.obfuscatedId,
          ...(opts?.oldToken
            ? {
                subscriptionUpdateParamsAndroid: {
                  oldPurchaseToken: opts.oldToken,
                },
              }
            : {}),
        },
      },
    });
    return p;
  }

  const value = useMemo<IapContextValue>(
    () => ({
      connected,
      loading: loading || !connected,
      subscriptions: catalog,
      buyPlan,
      restore: loadCatalogAndState,
    }),
    [connected, catalog, loading, buyPlan, loadCatalogAndState],
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

  if (Platform.OS === EPlatform.ANDROID) {
    return {
      platform: EPlatform.ANDROID,
      packageName: anyP.packageNameAndroid,
      productId: getProductId(p),
      purchaseToken: anyP.purchaseTokenAndroid ?? anyP.purchaseToken,
      orderId: anyP.orderIdAndroid ?? anyP.orderId,
    };
  }

  return {
    platform: EPlatform.IOS,
    productId,
    transactionId: anyP.transactionIdIOS ?? anyP.transactionId,
    receipt: anyP.transactionReceiptIOS ?? anyP.transactionReceipt,
    originalTransactionId:
      anyP.originalTransactionIdIOS ?? anyP.originalTransactionIdentifierIOS,
  };
}
