import { apiRequest } from "@/utils";
import { CodeStatus } from "@/types";

export async function deleteAccountApi(email: string, code: string) {
  try {
    const res = await apiRequest({
      url: `/users/delete-account-by-verification-code`,
      method: "POST",
      data: { email, code },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status: CodeStatus;
    };
  } catch (err: any) {
    console.error("deleteAccountApi error response", err.response);
    throw err;
  }
}
