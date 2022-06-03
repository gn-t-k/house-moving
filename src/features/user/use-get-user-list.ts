import { useCallback, useState } from "react";
import { User } from "./user";
import { getUsersCollection } from "@/libs/firebase/firestore/query/get-users-collection";

type UseGetUserList = () => {
  isLoading: boolean;
  getUserList: () => Promise<void>;
  userList: User[];
  error: string | null;
};
export const useGetUserList: UseGetUserList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const getUserList = useCallback(async () => {
    setIsLoading(true);
    const result = await getUsersCollection();

    setUserList(result.isSuccess ? result.data : []);
    setError(result.isSuccess ? null : result.failure.message);
    setIsLoading(false);
  }, []);

  return { isLoading, getUserList, userList, error };
};
