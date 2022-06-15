import { useCallback, useState } from "react";
import { createUserID, User, UserID } from "./user";
import { addToUsersCollection } from "@/libs/firebase/firestore/command/add-to-users-collection";
import { useGetRequest } from "@/util/api-routes-types/use-get-request";
import { usePostRequest } from "@/util/api-routes-types/use-post-request";

type UseCreateUser = (user: User) => {
  isLoading: boolean;
  createdUserID: UserID | null;
  error: string | null;
};
export const useCreateUser: UseCreateUser = (user) => {
  const { isLoading, data, error } = usePostRequest("/api/users", {
    requestInit: { body: user },
  });

  return {
    isLoading,
    createdUserID: data,
    error: error?.message ?? null,
  };
};
