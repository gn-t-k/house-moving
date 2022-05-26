export type Result<T> =
  | {
      isSuccess: true;
      data: T;
    }
  | {
      isSuccess: false;
      failure: Failure;
    };

type Failure = {
  message: string;
};
