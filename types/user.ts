import type { Plan } from "@/types/plan";
import type { Entry } from "@/types/entry";
import type { TokenUsageHistory, UserTokenUsage } from "@/types/token";
import type { Payment } from "@/types/payment";

export type User = {
  id: string;
  uuid: string;
  email?: string | null;
  phone?: string | null;
  oauthProvider?: string | null;
  oauthProviderId?: string | null;
  name?: string | null;
  isRegistered: boolean;
  passwordResetToken?: string | null;
  passwordChangeToken?: string | null;
  emailVerified: boolean;
  emailVerificationToken?: string | null;
  diaryEntries: Entry[];
  plan: Plan;
  tokenUsageHistory: TokenUsageHistory[];
  payments: Payment[];
};
