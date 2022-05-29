import { useCallback } from "react";
import { createUserID, User, UserID } from "./user";
import { addToUsersCollection } from "@/libs/firebase/firestore/command/create-user";
import { Result } from "@/util/result";

export type CreateUser = (user: User) => Promise<Result<UserID>>;

type UseCreateUser = () => {
  createUser: CreateUser;
};
export const useCreateUser: UseCreateUser = () => {
  const createUser: CreateUser = useCallback(async (user) => {
    const result = await addToUsersCollection(user);

    return result.isSuccess
      ? {
          ...result,
          data: createUserID(result.data.id),
        }
      : result;
  }, []);

  return {
    createUser,
  };
};
