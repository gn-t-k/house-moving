import qs from "query-string";
import { useState } from "react";
import useSWR, { SWRConfiguration, mutate } from "swr";
import { isResult } from "./is-result";
import type { GetReqQuery, GetResBody, Error } from "@/api-routes-types";

export const useGetRequest = <
  T extends keyof GetResBody,
  ReqQuery extends GetReqQuery[T],
  ResBody extends GetResBody[T]
>(
  key: T,
  query?: ReqQuery,
  swrConfig?: SWRConfiguration
): {
  sendRequest: (_options: {
    query?: ReqQuery;
    requestInit?: RequestInit;
  }) => void;
  isLoading: boolean;
  data: ResBody | null;
  error: Error["error"] | null;
} => {
  const getURL = (query?: ReqQuery) =>
    query ? `${key}?${qs.stringify(query)}` : key;
  const [url, setURL] = useState<string>(getURL(query));

  const { data, error } = useSWR<ResBody, Error["error"]>(url, null, swrConfig);

  const sendRequest = (
    options: {
      query?: ReqQuery;
      requestInit?: RequestInit;
    } = {}
  ) => {
    const { query, requestInit } = options;
    setURL(getURL(query));

    mutate(url, async (): Promise<ResBody> => {
      const response = await fetch(url, requestInit);

      const result = await response.json();

      if (isResult<ResBody>(result)) {
        if (result.isSuccess) {
          return result.data;
        }

        throw result.error;
      }

      const error: Error["error"] = {
        httpStatus: 500,
        message: "something went wrong",
      };
      throw error;
    });
  };

  return {
    sendRequest,
    isLoading: data === undefined && error === undefined,
    data: data ?? null,
    error: error ?? null,
  };
};
