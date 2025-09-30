import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";

export async function forgotPasswordApi(email: string, lang: string) {
  try {
    const res = await apiRequest({
      url: `/auth/reset-password`,
      method: "POST",
      data: { email, lang },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status: CodeStatus;
      retryAfterSec: number;
      message?: string;
    };
  } catch (err: any) {
    console.log("forgotPasswordApi error response", err.response);
    throw err;
  }
}
