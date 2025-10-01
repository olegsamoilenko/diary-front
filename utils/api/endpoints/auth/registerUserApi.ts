import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";
import type { User } from "@/types";

export async function registerUserApi(
  email: string,
  password: string,
  lang: string,
  uuid: string,
) {
  try {
    const res = await apiRequest({
      url: `/auth/registration`,
      method: "POST",
      data: { email, password, lang, uuid },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status: CodeStatus;
      retryAfterSec: number;
      user: User;
    };
  } catch (err: any) {
    console.error("Register user error response", err.response);
    throw err;
  }
}
