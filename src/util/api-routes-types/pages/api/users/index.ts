import { GetHandler, PostHandler } from "@/pages/api/users";

declare module "@/api-routes-types" {
  interface GetReqQuery {
    "/api/users": ReqQuery<GetHandler>;
  }
  interface GetReqBody {
    "/api/users": ReqBody<GetHandler>;
  }
  interface GetResBody {
    "/api/users": ResBody<GetHandler>;
  }
  interface PostReqQuery {
    "/api/users": ReqQuery<PostHandler>;
  }
  interface PostReqBody {
    "/api/users": ReqBody<PostHandler>;
  }
  interface PostResBody {
    "/api/users": ResBody<PostHandler>;
  }
}
