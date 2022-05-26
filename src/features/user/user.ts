export type User = {
  name: string;
  tel: string;
  bloodType: BloodType | null;
};

export const bloodType = {
  a: "A",
  b: "B",
  o: "O",
  ab: "AB",
} as const;
export type BloodType = typeof bloodType[keyof typeof bloodType];
