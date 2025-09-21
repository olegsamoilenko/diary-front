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
  ACTIVE = "active",
  INACTIVE = "inactive",
  CANCELED = "canceled",
  EXPIRED = "expired",
  IN_GRACE_PERIOD = "in grace period",
  ON_HOLD = "on hold",
  PAUSED = "paused",
  RESTARTED = "restarted",
  REFUNDED = "refunded",
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
