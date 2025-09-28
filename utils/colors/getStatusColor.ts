import { PlanStatus } from "@/types/";

export function getStatusColor(status: PlanStatus): string {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "INACTIVE":
      return "gray";
    case "CANCELED":
      return "red";
    case "EXPIRED":
      return "orange";
    case "IN_GRACE":
      return "yellow";
    case "ON_HOLD":
      return "blue";
    case "PAUSED":
      return "purple";
    case "RESTARTED":
      return "teal";
    case "REFUNDED":
      return "pink";
    default:
      return "black";
  }
}
