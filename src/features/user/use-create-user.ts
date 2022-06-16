import { User, UserID } from "./user";
import { usePostRequest } from "@/util/api-routes-types/use-post-request";

type UseCreateUser = () => {
  createUser: (user: User) => Promise<void>;
  isLoading: boolean;
  createdUserID: UserID | null;
  error: string | null;
};
export const useCreateUser: UseCreateUser = () => {
  const { sendRequest, isLoading, data, error } = usePostRequest("/api/users");

  const createUser = async (user: User) => {
    await sendRequest(user);
  };

  return {
    createUser,
    isLoading,
    createdUserID: data,
    error: error?.message ?? null,
  };
};
