export interface Data<T> {
  data: T;
}
export interface Error {
  error: {
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
