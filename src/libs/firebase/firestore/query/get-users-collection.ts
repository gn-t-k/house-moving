import { collection, getDocs } from "firebase/firestore";
import { isInvalidUser, usersConverter } from "../collection/users";
import { firestore } from "../instance";
import { User } from "@/features/user/user";
import { Result } from "@/util/result";

type GetUsersCollection = () => Promise<Result<User[]>>;
export const getUsersCollection: GetUsersCollection = async () => {
  try {
    const usersCollectionRef = collection(firestore, "users").withConverter(
      usersConverter
    );

    const snapShot = await getDocs(usersCollectionRef);

    const removeInvalidUser = (userList: User[]) =>
      userList.filter((user) => !isInvalidUser(user));

    const data = removeInvalidUser(snapShot.docs.map((doc) => doc.data()));

    console.info(data);

    return {
      isSuccess: true,
      data,
    };
  } catch (e) {
    console.error(e);

    return {
      isSuccess: false,
      failure: {
        message: e instanceof Error ? e.message : "internal error",
      },
    };
  }
};
