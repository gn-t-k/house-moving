import qs from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isResult } from "./is-result";
import {
  PostResBody,
  PostReqQuery,
  PostReqBody,
  Error,
} from "@/api-routes-types";

export const usePostRequest = <
  T extends keyof PostResBody,
  ReqQuery extends PostReqQuery[T],
  ResBody extends PostResBody[T],
  ReqBody extends PostReqBody[T]
>(
  key: T
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ResBody | null>(null);
  const [error, setError] = useState<Error["error"] | null>(null);

  const sendRequest = useCallback(
    async (
      body?: ReqBody,
      {
        query,
        requestInit,
      }: {
        query?: ReqQuery;
        requestInit?: Omit<RequestInit, "body">;
      } = {}
    ) => {
      const defaultHeaders = {
        "Content-Type": "application/json",
      };
      const url = query ? `${key}?${qs.stringify(query)}` : key;

      setIsLoading(true);
      setData(null);
      setError(null);

      const result = await fetch(url, {
        ...requestInit,
        method: "POST",
        headers: { ...defaultHeaders, ...requestInit?.headers },
        body: body ? JSON.stringify(body) : undefined,
      })
        .then((res) => {
          if (isResult<ResBody>(result)) {
            if (result.isSuccess) {
              setData(result.data);
            } else {
              setError(result.error);
            }
          } else {
            setError({
              httpStatus: 500,
              message: "something went wrong",
            });
          }

          return res.json();
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [key]
  );

  return {
    sendRequest,
    isLoading,
    data,
    error,
  };
};
