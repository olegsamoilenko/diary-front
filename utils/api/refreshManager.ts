import axios from "axios";
import { signRefreshPayload } from "@/utils/auth/deviceKeys";

let isRefreshing = false;
let queue: ((newAccess: string) => void)[] = [];

export function waitForRefresh(): Promise<string> {
  return new Promise((resolve) => queue.push(resolve));
}

export function resolveRefresh(newAccess: string) {
  queue.forEach((fn) => fn(newAccess));
  queue = [];
}

export function setRefreshing(v: boolean) {
  isRefreshing = v;
}
export function getRefreshing() {
  return isRefreshing;
}

export async function callRefresh(
  API_BASE: string,
  body: {
    userId: number;
    deviceId: string;
    refreshToken: string;
  },
) {
  const ts = Date.now();
  const sig = await signRefreshPayload({
    userId: body.userId,
    deviceId: body.deviceId,
    refreshToken: body.refreshToken,
    ts,
  });
  const { data } = await axios.post(`${API_BASE}/sessions/refresh`, {
    ...body,
    ts,
    sig,
  });
  return data as {
    accessToken: string;
    refreshToken: string;
    deviceId: string;
  };
}
