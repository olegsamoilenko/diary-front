export interface IapProduct {
  id: string;
  title: string;
  displayName: string;
  description: string;
  displayPrice: string;
  price: number;
  currency: string;
  platform: "android" | "ios" | "web";
  type: "subs" | "inapp";
  debugDescription: string | null;

  nameAndroid?: string;
  subscriptionOfferDetailsAndroid?: AndroidSubscriptionOfferDetails[];
  oneTimePurchaseOfferDetailsAndroid?:
    | AndroidOneTimePurchaseOfferDetails
    | undefined;
}

export interface AndroidOneTimePurchaseOfferDetails {
  priceAmountMicros: string;
  priceCurrencyCode: string;
  formattedPrice: string;
}

export interface AndroidSubscriptionOfferDetails {
  basePlanId: string;
  offerTags: string[];
  offerToken: string;
  pricingPhases: PricingPhases;
}

export interface PricingPhases {
  pricingPhaseList: PricingPhase[];
}

export interface PricingPhase {
  billingCycleCount: number;
  billingPeriod: string;
  formattedPrice: string;
  priceAmountMicros: string;
  priceCurrencyCode: string;
  recurrenceMode?: 1 | 2 | 3 | number;
}
