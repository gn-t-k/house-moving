import { addDoc, collection } from "firebase/firestore";
import { usersConverter } from "../collection/users-converter";
import { User } from "@/features/user/user";
import { firestore } from "@/libs/firebase/firestore/instance";
import { Result } from "@/util/result";

type AddToUsersCollection = (
  requestParams: User
) => Promise<Result<{ id: string }>>;
export const addToUsersCollection: AddToUsersCollection = async (props) => {
  try {
    const userDocRef = await addDoc(
      collection(firestore, "users").withConverter(usersConverter),
      props
    );

    return {
      isSuccess: true,
      data: {
        id: userDocRef.id,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "internal error";

    return {
      isSuccess: false,
      failure: {
        message,
      },
    };
  }
};
