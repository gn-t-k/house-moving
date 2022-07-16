import { Muscle } from "../muscle/muscle";

export type Exercise = {
  id: string;
  name: string;
  targets: Target[];
  memo: string;
};

type Target = {
  muscle: Muscle;
  ratio: number;
};
