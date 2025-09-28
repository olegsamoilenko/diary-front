import { CodeStatus, StatusCode } from "@/types";

export type ErrorsType = {
  response: {
    data: {
      code: string;
      message: string;
      statusCode: number;
      statusMessage: string;
    };
  };
};

export type Rejected = {
  message: string;
  status?: CodeStatus | StatusCode;
  code?: string;
  retryAfterSec?: number;
};
