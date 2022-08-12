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

export const isResult = <T>(value: unknown): value is Result<T> => {
  const result = value as Result<T>;

  return (
    typeof result.isSuccess === "boolean" &&
    ((result.isSuccess === true && result.data !== undefined) ||
      (result.isSuccess === false &&
        result.error !== undefined &&
        typeof result.error.message === "string"))
  );
};
