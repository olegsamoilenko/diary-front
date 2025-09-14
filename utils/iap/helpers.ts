import type { Product } from "react-native-iap";

export const isSub = (p: Product) => p?.type === "subs";

export const getAndroidOfferTokenFromProduct = (
  p: Product,
): string | undefined => {
  const anyP = p as any;
  const offers =
    anyP.subscriptionOfferDetailsAndroid ?? anyP.subscriptionOfferDetails;
  return Array.isArray(offers) ? offers[0]?.offerToken : undefined;
};

export const getProductTitle = (p: Product) =>
  (p as any).displayName ?? (p as any).title ?? p.id;

export const getProductPrice = (p: Product) =>
  (p as any).displayPrice ??
  (p as any).oneTimePurchaseOfferFormattedPrice ??
  "";
