import { FirestoreDataConverter } from "firebase/firestore";
import { FirestoreUser } from "./users";
import { createUserID, User } from "@/features/user/user";

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

    return {
      // TODO: ユーザー定義型ガード
      identified: true,
      id: createUserID(snapshot.id),
      name: data.name,
      tel: data.tel,
      bloodType: data.bloodType,
    };
  },
};
