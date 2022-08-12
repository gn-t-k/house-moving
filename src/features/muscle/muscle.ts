export type Muscle = {
  id: string;
  name: string;
};

export const isMuscle = (value: unknown): value is Muscle => {
  const muscle = value as Muscle;

  return (
    !!muscle &&
    typeof muscle.id === "string" &&
    muscle.id !== "" &&
    typeof muscle.name === "string" &&
    muscle.name !== ""
  );
};
