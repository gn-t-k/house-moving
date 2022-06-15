import qs from "query-string";
import useSWR, { SWRConfiguration } from "swr";
import { isResult } from "./is-result";
import type { GetReqQuery, GetResBody, Error } from "@/api-routes-types";

export const useGetRequest = <
  T extends keyof GetResBody,
  ReqQuery extends GetReqQuery[T],
  ResBody extends GetResBody[T]
>(
  key: T,
  {
    query,
    requestInit,
    swrConfig,
  }: {
    query?: ReqQuery;
    requestInit?: RequestInit;
    swrConfig?: SWRConfiguration;
  } = {}
): {
  isLoading: boolean;
  data: ResBody | null;
  error: Error["error"] | null;
} => {
  const url = query ? `${key}?${qs.stringify(query)}` : key;

  const { data, error } = useSWR<ResBody, Error["error"]>(
    url,
    async (): Promise<ResBody> => {
      const result = await fetch(url, requestInit).then((res) => res.json());

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
    },
    swrConfig
  );

  return {
    isLoading: data === undefined && error === undefined,
    data: data ?? null,
    error: error ?? null,
  };
};
