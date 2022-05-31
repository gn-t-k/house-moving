import { useCallback } from "react";
import { User } from "./user";
import { getUsersCollection } from "@/libs/firebase/firestore/query/get-users-collection";
import { Result } from "@/util/result";

export type GetUserList = () => Promise<Result<User[]>>;

type UseGetUserList = () => { getUserList: GetUserList };
export const useGetUserList: UseGetUserList = () => {
  const getUserList = useCallback(async () => {
    const result = await getUsersCollection();

    return result;
  }, []);

  return { getUserList };
};
