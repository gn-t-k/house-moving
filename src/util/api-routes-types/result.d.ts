declare module "@/api-routes-types" {
  interface Data<T> {
    data: T;
  }
  interface Error {
    error: {
      httpStatus: number;
      message: string;
    };
  }
  export type Result<T> =
    | ({
        isSuccess: true;
      } & Data<T>)
    | ({
        isSuccess: false;
      } & Error);
}
