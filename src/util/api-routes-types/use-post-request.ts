import qs from "query-string";
import { useEffect, useState } from "react";
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
  key: T,
  {
    query,
    requestInit,
  }: {
    query?: ReqQuery;
    requestInit?: Omit<RequestInit, "body"> & { body?: ReqBody };
  } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ResBody | null>(null);
  const [error, setError] = useState<Error["error"] | null>(null);

  useEffect(() => {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };
    const url = query ? `${key}?${qs.stringify(query)}` : key;

    (async () => {
      setIsLoading(true);
      setError(null);

      const result = await fetch(url, {
        ...requestInit,
        method: "POST",
        headers: { ...defaultHeaders, ...requestInit?.headers },
        body: requestInit?.body ? JSON.stringify(requestInit.body) : undefined,
      })
        .then((res) => res.json())
        .finally(() => {
          setIsLoading(false);
        });

      if (isResult<ResBody>(result)) {
        if (result.isSuccess) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      }
    })();
  }, [key, query, requestInit]);

  return {
    isLoading,
    data,
    error,
  };
};
