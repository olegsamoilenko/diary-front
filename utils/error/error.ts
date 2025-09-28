import { CodeStatus, StatusCode } from "@/types";

export const normErr = (err: any, text: string) => ({
  message: err?.response?.data?.message ?? err?.message ?? text,
  code: err?.response?.data?.code as string | undefined,
  status: err?.response?.data?.status as CodeStatus | StatusCode | undefined,
});
