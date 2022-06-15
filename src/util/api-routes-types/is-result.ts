import { Result } from "@/api-routes-types";

export const isResult = <T>(props: unknown): props is Result<T> => {
  const result = props as Partial<Result<T>>;

  return (
    typeof result.isSuccess === "boolean" &&
    ((result.isSuccess === true && result.data !== undefined) ||
      (result.isSuccess === false &&
        result.error !== undefined &&
        typeof result.error.httpStatus === "number" &&
        typeof result.error.httpStatus === "string"))
  );
};
