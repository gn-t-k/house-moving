import { User } from "./user";
import { useGetRequest } from "@/util/api-routes-types/use-get-request";

type UseGetUserList = () => {
  userList: User[] | null;
  isLoading: boolean;
  error: string | null;
};
export const useGetUserList: UseGetUserList = () => {
  const { isLoading, data, error } = useGetRequest("/api/users");

  return {
    isLoading,
    userList: data,
    error: error?.message ?? null,
  };
};
