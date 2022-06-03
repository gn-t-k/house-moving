import { FirestoreDataConverter } from "firebase/firestore";
import {
  BloodType,
  createUserID,
  isBloodType,
  User,
} from "@/features/user/user";

export type FirestoreUser = {
  name: string;
  tel: string;
  bloodType: string;
};

type ValidUserData = FirestoreUser & {
  bloodType: BloodType | "";
};

export const usersConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User): FirestoreUser => {
    const firestoreUser: FirestoreUser = {
      name: user.name,
      tel: user.tel,
      bloodType: user.bloodType === null ? "" : user.bloodType,
    };

    return firestoreUser;
  },
  fromFirestore: (snapshot, options): User => {
    const data = snapshot.data(options);

    const isValidUserData = (data: unknown): data is ValidUserData => {
      const user = data as ValidUserData;

      return (
        user?.name !== undefined &&
        user?.name !== "" &&
        !Number.isNaN(parseInt(user?.tel)) &&
        (user?.bloodType === "" || isBloodType(user?.bloodType))
      );
    };

    return isValidUserData(data)
      ? {
          identified: true,
          id: createUserID(snapshot.id),
          name: data.name,
          tel: data.tel,
          bloodType: data.bloodType === "" ? null : data.bloodType,
        }
      : invalidUser;
  },
};

// 不正なデータを取得した場合これを返す
const invalidUser: User = {
  identified: false,
  name: "invalid user",
  tel: "",
  bloodType: null,
};
export const isInvalidUser = (user: User): user is typeof invalidUser =>
  user.identified === invalidUser.identified &&
  user.name === invalidUser.name &&
  user.tel === invalidUser.tel &&
  user.bloodType === invalidUser.bloodType;
