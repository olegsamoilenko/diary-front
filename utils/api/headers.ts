import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

export function ensureAxiosHeaders(
  config: InternalAxiosRequestConfig,
): AxiosHeaders {
  const h = config.headers as AxiosHeaders;
  if (h && typeof h.set === "function") return h;
  const made = axios.AxiosHeaders.from(h ?? {});
  config.headers = made;
  return made;
}

export function setAuthHeader(
  config: InternalAxiosRequestConfig,
  accessToken: string,
) {
  const headers = ensureAxiosHeaders(config);
  headers.set("Authorization", `Bearer ${accessToken}`);
}

export function ensureJsonContentType(config: InternalAxiosRequestConfig) {
  const headers = ensureAxiosHeaders(config);
  if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
}
