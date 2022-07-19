import { Exercise } from "../exercise/exercise";
import { Trainee } from "../trainee/trainee";

export type Workout = {
  id: string;
  trainee: Trainee;
  workoutSets: WorkoutSet[];
  date: Date;
  memo: string;
};

type WorkoutSet = {
  exercise: Exercise;
  weight: number;
  repetition: number;
};
