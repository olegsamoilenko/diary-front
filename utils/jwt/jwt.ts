export type JwtPayload = { exp?: number; iat?: number; [k: string]: any };

export function decodeJwt<T extends object = JwtPayload>(
  token: string,
): T | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(base64UrlToBase64(payload));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function base64UrlToBase64(s: string) {
  return (
    s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)
  );
}

export function isExpiredOrNearExpiry(token: string, skewSec = 30): boolean {
  const payload = decodeJwt<JwtPayload>(token);
  if (!payload?.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSec + skewSec;
}
