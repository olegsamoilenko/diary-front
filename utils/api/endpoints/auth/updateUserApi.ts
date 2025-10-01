import { apiRequest } from "@/utils";
import type { User } from "@/types";

export async function updateUserApi(data: Partial<User>) {
  try {
    const res = await apiRequest({
      url: `/users/update`,
      method: "PATCH",
      data,
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      user: User;
    };
  } catch (err: any) {
    console.error("Update user error", err);
    console.error("Update user error response", err.response);
    throw err;
  }
}
