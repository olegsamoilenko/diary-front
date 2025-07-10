import React from "react";

export function isRefObject<T>(ref: any): ref is React.RefObject<T> {
  return ref && typeof ref === "object" && "current" in ref;
}
