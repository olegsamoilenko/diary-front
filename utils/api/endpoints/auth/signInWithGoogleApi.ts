import { apiRequest } from "@/utils/api/apiRequest";
import type { Plan, User, UserSettings } from "@/types";

export async function signInWithGoogleApi(
  userId: number,
  uuid: string,
  idToken: string,
) {
  try {
    const res = await apiRequest({
      url: `/auth/sign-in-with-google`,
      method: "POST",
      data: {
        userId,
        uuid,
        idToken,
      },
    });
    if (res?.status !== 201 && res?.status !== 200) return null;
    return res.data as {
      accessToken: string;
      refreshToken: string;
      deviceId: string;
      user: User;
      plan?: Plan;
      settings?: UserSettings;
    };
  } catch (err: any) {
    console.log("signInWithGoogleApi error response", err.response);
    throw err;
  }
}
