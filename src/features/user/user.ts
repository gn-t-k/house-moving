import { UserList } from "./user-list/user-list";

export type User = {
  name: string;
  tel: string;
  bloodType: BloodType | null;
} & (
  | {
      identified: false;
    }
  | {
      identified: true;
      id: UserID;
    }
);

export type UserID = {
  type: "UserID";
  value: string;
};
export const createUserID = (id: string): UserID => ({
  type: "UserID",
  value: id,
});

export const bloodType = {
  a: "A",
  b: "B",
  o: "O",
  ab: "AB",
} as const;
export type BloodType = typeof bloodType[keyof typeof bloodType];
export const isBloodType = (value: string): value is BloodType =>
  Object.values(bloodType).some((v) => v === value);

export const identify = (userList: User[]): (User & { identified: true })[] =>
  userList.flatMap((user) => (user.identified ? [user] : []));
