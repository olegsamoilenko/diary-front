import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";

export async function resendEmailVerificationCodeApi(
  email: string,
  lang: string,
  type: "register" | "newEmail",
) {
  try {
    const res = await apiRequest({
      url: `/auth/resend-code`,
      method: "POST",
      data: { email, lang, type },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status?: CodeStatus;
      retryAfterSec?: number;
      message?: string;
    };
  } catch (err: any) {
    console.log("resendEmailVerificationCodeApi error response", err.response);
    throw err;
  }
}
