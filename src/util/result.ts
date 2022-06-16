type Data<T> = {
  data: T;
};
type Error = {
  error: {
    message: string;
  };
};
export type Result<T> =
  | ({
      isSuccess: true;
    } & Data<T>)
  | ({
      isSuccess: false;
    } & Error);
