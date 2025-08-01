import { PlanStatus } from "@/types/";

export function getStatusColor(status: PlanStatus): string {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "gray";
    case "canceled":
      return "red";
    case "expired":
      return "orange";
    case "in grace period":
      return "yellow";
    case "on hold":
      return "blue";
    case "paused":
      return "purple";
    case "restarted":
      return "teal";
    case "refunded":
      return "pink";
    default:
      return "black";
  }
}
