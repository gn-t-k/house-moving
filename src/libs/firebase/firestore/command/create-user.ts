import { addDoc, collection } from "firebase/firestore";
import { Users as FirestoreUsers } from "../collection/users";
import { User } from "@/features/user/user";
import { firestore } from "@/libs/firebase/firestore/instance";
import { Convert } from "@/util/convert";
import { Result } from "@/util/result";

type AddToUsersCollection = (
  requestParams: FirestoreUsers
) => Promise<Result<{ id: string }>>;
export const addToUsersCollection: AddToUsersCollection = async (props) => {
  try {
    const userDocRef = await addDoc(collection(firestore, "users"), {
      name: props.name,
      tel: props.tel,
      bloodType: props.bloodType,
    });

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

type GetRequestParams = Convert<User, FirestoreUsers>;
export const getRequestParams: GetRequestParams = (props) => ({
  name: props.name,
  tel: props.tel,
  bloodType: props.bloodType === null ? "" : props.bloodType,
});
