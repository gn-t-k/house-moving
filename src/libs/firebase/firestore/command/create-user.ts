import { addDoc, collection } from "firebase/firestore";
import { User } from "@/features/user/user";
import { firestore } from "@/libs/firebase/firestore";
import { Convert } from "@/util/convert";
import { Result } from "@/util/result";

type CreateUser = (requestParams: {
  name: string;
  tel: string;
  bloodType: string;
}) => Promise<Result<void>>;
export const createUser: CreateUser = async (props) => {
  try {
    await addDoc(collection(firestore, "tests"), {
      name: props.name,
      tel: props.tel,
      bloodType: props.bloodType,
    });

    return {
      isSuccess: true,
      data: undefined,
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

type GetRequestParams = Convert<User, Parameters<CreateUser>[0]>;
export const getRequestParams: GetRequestParams = (props: User) => ({
  name: props.name,
  tel: props.tel,
  bloodType: props.bloodType === null ? "" : props.bloodType,
});
