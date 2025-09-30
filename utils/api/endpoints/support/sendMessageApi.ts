import { apiRequest } from "@/utils";
import { CodeStatus, SupportCategory } from "@/types";

export async function sendMessageApi(
  email: string,
  category: SupportCategory,
  title: string,
  text: string,
) {
  try {
    const res = await apiRequest({
      url: `/support/create-message`,
      method: "POST",
      data: { email, category, title, text },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      status?: CodeStatus;
    };
  } catch (err: any) {
    console.log(
      "sendVerificationCodeForUserDeleteApi error response",
      err.response,
    );
    throw err;
  }
}
