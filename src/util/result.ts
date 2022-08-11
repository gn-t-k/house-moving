export type Result<T> =
  | ({
      isSuccess: true;
    } & Data<T>)
  | ({
      isSuccess: false;
    } & Error);

type Data<T> = {
  data: T;
};

type Error = {
  error: {
    message: string;
  };
};
