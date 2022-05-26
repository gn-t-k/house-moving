import { User } from "./user";
import {
  createUser,
  getRequestParams,
} from "@/libs/firebase/firestore/command/create-user";
import { Result } from "@/util/result";

type UseCreateUser = () => {
  createUser: (user: User) => Promise<Result<void>>;
};
export const useCreateUser: UseCreateUser = () => ({
  createUser: async (props) => await createUser(getRequestParams(props)),
});
