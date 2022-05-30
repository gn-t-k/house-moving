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

    if (!isValidUserData(data)) {
      throw new Error("Invalid User Data");
    }

    return {
      identified: true,
      id: createUserID(snapshot.id),
      name: data.name,
      tel: data.tel,
      bloodType: data.bloodType === "" ? null : data.bloodType,
    };
  },
};
