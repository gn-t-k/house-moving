import { useCallback, useState } from "react";
import { createUserID, User, UserID } from "./user";
import { addToUsersCollection } from "@/libs/firebase/firestore/command/create-user";

type UseCreateUser = () => {
  isLoading: boolean;
  createUser: (user: User) => Promise<void>;
  createdUserID: UserID | null;
  error: string | null;
};
export const useCreateUser: UseCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createdUserID, setCreatedUserID] = useState<UserID | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createUser = useCallback(async (user: User) => {
    setIsLoading(true);
    const result = await addToUsersCollection(user);

    setCreatedUserID(result.isSuccess ? createUserID(result.data.id) : null);
    setError(result.isSuccess ? null : result.failure.message);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    createUser,
    createdUserID,
    error,
  };
};
