import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";

export async function changePasswordApi(
  email: string,
  code: string,
  password: string,
) {
  try {
    const res = await apiRequest({
      url: `/auth/change-password`,
      method: "POST",
      data: { email, code, password },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status: CodeStatus;
      retryAfterSec: number;
      message?: string;
    };
  } catch (err: any) {
    console.error("changePasswordApi error response", err.response);
    throw err;
  }
}
