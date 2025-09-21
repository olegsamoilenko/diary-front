export enum Subscriptions {
  NEMORY = "nemory",
  NEMORY_BASE = "nemory_base",
}

export type Plan = {
  name: string;
  price: number;
  tokensLimit: number;
  descriptionKey: string;
  type?: PlanTypes;
  periodStart?: Date;
  periodEnd?: Date;
  status?: PlanStatus;
  usedTrial?: boolean;
};

export enum PlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  IN_GRACE = "IN_GRACE",
  ON_HOLD = "ON_HOLD",
  PAUSED = "PAUSED",
  RESTARTED = "RESTARTED",
  REFUNDED = "REFUNDED",
}

export enum PlanTypes {
  INTERNAL_TESTING = "internal_testing",
  CLOSED_TESTING = "closed_testing",
  OPEN_TESTING = "open_testing",
  PRODUCTION = "production",
}

export enum BasePlanIds {
  TESTING = "testing",
  START = "start-d7",
  LITE_M1 = "lite-m1",
  BASE_M1 = "base-m1",
  PRO_M1 = "pro-m1",
}
