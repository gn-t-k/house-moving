import { NextApiRequest, NextApiResponse } from "next";

declare module "@/api-routes-types" {
  export type ApiHandler<
    ReqQuery = unknown,
    ReqBody = any,
    ResBody = unknown
  > = (
    req: Omit<NextApiRequest, "body" | "query"> & {
      query: Partial<ReqQuery>;
      body?: ReqBody;
    },
    res: NextApiResponse<Result<ResBody>>
  ) => void | Promise<void>;
  type ReqQuery<T> = T extends ApiHandler<infer I, any, unknown> ? I : never;
  type ReqBody<T> = T extends ApiHandler<unknown, infer I, unknown> ? I : never;
  type ResBody<T> = T extends ApiHandler<unknown, any, infer I> ? I : never;
  interface GetResBody {}
  interface GetReqQuery {}
  interface GetReqBody {}
  interface PostResBody {}
  interface PostReqQuery {}
  interface PostReqBody {}
  interface PutResBody {}
  interface PutReqQuery {}
  interface PutReqBody {}
  interface PatchResBody {}
  interface PatchReqQuery {}
  interface PatchReqBody {}
  interface DeleteResBody {}
  interface DeleteReqQuery {}
  interface DeleteReqBody {}
}
