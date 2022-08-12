export type Trainee = {
  id: string;
  name: string;
  image: string;
};

export const isTrainee = (value: unknown): value is Trainee => {
  const trainee = value as Trainee;

  return (
    !!trainee &&
    typeof trainee.id === "string" &&
    typeof trainee.name === "string" &&
    typeof trainee.image === "string"
  );
};
