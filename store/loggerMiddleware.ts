import { Middleware } from "@reduxjs/toolkit";

const clone = <T>(v: T): T => {
  try {
    return structuredClone(v);
  } catch {
    return JSON.parse(JSON.stringify(v));
  }
};

export const loggerMiddleware: Middleware = (api) => (next) => (action) => {
  if (!__DEV__) return next(action);

  const prev = api.getState();
  const result = next(action);
  const nextState = api.getState();

  const prevSnap = clone({
    user: prev.user,
    settings: prev.settings,
    plan: prev.plan,
  });

  const nextSnap = clone({
    user: nextState.user,
    settings: nextState.settings,
    plan: nextState.plan,
  });

  const changed = {
    user: prev.user !== nextState.user,
    settings: prev.settings !== nextState.settings,
    plan: prev.plan !== nextState.plan,
  };

  // @ts-ignore
  console.groupCollapsed(`[REDUX] ${action.type}`);
  console.log("changed refs:", changed);
  console.log("prev:", prevSnap);
  console.log("next:", nextSnap);
  console.log("action:", action);
  console.groupEnd();

  return result;
};
