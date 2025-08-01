export type Plan = {
  name: string;
  price: number;
  tokensLimit: number;
  descriptionKey: string;
  status: PlanStatus;
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
