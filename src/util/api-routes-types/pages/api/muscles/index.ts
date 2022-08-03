import { GetHandler, PostHandler } from "@/pages/api/muscles";

declare module "@/api-routes-types" {
  interface GetReqQuery {
    "/api/muscles": ReqQuery<GetHandler>;
  }
  interface GetReqBody {
    "/api/muscles": ReqBody<GetHandler>;
  }
  interface GetResBody {
    "/api/muscles": ResBody<GetHandler>;
  }
  interface PostReqQuery {
    "/api/muscles": ReqQuery<PostHandler>;
  }
  interface PostReqBody {
    "/api/muscles": ReqBody<PostHandler>;
  }
  interface PostResBody {
    "/api/muscles": ResBody<PostHandler>;
  }
}
