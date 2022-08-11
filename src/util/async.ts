import { Result } from "./result";

export type Async<Res> =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | ({
      status: "done";
    } & Result<Res>);
