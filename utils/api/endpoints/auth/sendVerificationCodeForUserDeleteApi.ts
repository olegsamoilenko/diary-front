import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";

export async function sendVerificationCodeForUserDeleteApi(
  email: string,
  type: "send" | "resend",
) {
  try {
    const res = await apiRequest({
      url: `/users/send-verification-code-for-delete`,
      method: "POST",
      data: { email, type },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status?: CodeStatus;
      retryAfterSec?: number;
      message?: string;
    };
  } catch (err: any) {
    console.log(
      "sendVerificationCodeForUserDeleteApi error response",
      err.response,
    );
    throw err;
  }
}
