import type { Product } from "react-native-iap";

export const isSub = (p: Product) =>
  Array.isArray((p as any).subscriptionOfferDetails) &&
  (p as any).subscriptionOfferDetails.length > 0;

export const isInapp = (p: Product) =>
  !!(p as any).oneTimePurchaseOfferDetailsAndroid;

export const getAndroidOfferTokenFromProduct = (
  p: Product,
): string | undefined => {
  const details = (p as any).subscriptionOfferDetails as
    | { offerToken?: string }[]
    | undefined;
  return details?.[0]?.offerToken;
};
