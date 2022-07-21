import { Exercise } from "../exercise/exercise";
import { Trainee } from "../trainee/trainee";

export type Workout = {
  id: string;
  trainee: Trainee;
  records: Record[];
  date: Date;
  memo: string;
};

type Record = {
  exercise: Exercise;
  weight: number;
  repetition: number;
};
