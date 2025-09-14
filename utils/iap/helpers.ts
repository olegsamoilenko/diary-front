import type { Product } from "react-native-iap";

/** це підписка, якщо є Android-деталі підписки */
export const isSub = (p: Product) =>
  Array.isArray((p as any).subscriptionOfferDetails);

/** витягаємо offerToken для Android-підписок (потрібен для покупки) */
export const getAndroidOfferTokenFromProduct = (p: Product) => {
  const details = (p as any).subscriptionOfferDetails;
  return Array.isArray(details) ? details[0]?.offerToken : undefined;
};

export const getProductTitle = (p: Product) =>
  (p as any).title ?? (p as any).displayNameIOS ?? p.id;

export const getProductPrice = (p: Product) =>
  (p as any).displayPrice ?? (p as any).localizedPrice ?? "";
