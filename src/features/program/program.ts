import { Exercise } from "../exercise/exercise";

export type Program = {
  id: string;
  name: string;
  contents: Content[];
  memo: string;
};

type Content = {
  exercise: Exercise;
  repetition: number;
  set: number;
};
