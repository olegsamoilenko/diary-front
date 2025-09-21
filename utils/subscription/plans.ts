export function getPlanName(planId: string): string {
  const plans: Record<string, string> = {
    "lite-m1": "Lite",
    "base-m1": "Base",
    "pro-m1": "Pro",
  };
  return plans[planId] || "Unknown Plan";
}
