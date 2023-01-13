import { Send } from "express-serve-static-core";

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export interface TypeRequestPost<T> extends Express.Request {
  body: T;
  user: { id: number; email: string };
}
export interface TypedRequestQuery<T> extends Express.Request {
  query: T;
}
export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}
export type IAuthRequest = any;
export type IAuthResponse = any;
