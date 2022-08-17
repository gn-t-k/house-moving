import { ulid } from "ulid";
import { Muscle } from "../muscle/muscle";
import { hasAtLeastOne } from "@/util/has-at-least-one";

export class Exercise {
  private _id: string;
  private _name: string;
  private _targets: [Target, ...Target[]];
  private _memo: string;

  public constructor(props: {
    id?: string;
    name: string;
    targets: Target[];
    memo: string;
  }) {
    this._id = props.id ?? ulid();

    this._name = props.name;

    if (!hasAtLeastOne(props.targets)) {
      throw new Error(errorMessages.emptyTargetsArray);
    }
    const isTargetDuplicated = (() => {
      const muscleIds = props.targets.map((target) => target.muscle.id);

      return new Set(muscleIds).size !== muscleIds.length;
    })();
    if (isTargetDuplicated) {
      throw new Error(errorMessages.duplicatedTarget);
    }
    const totalRatio = props.targets
      .map((target) => target.ratio)
      .reduce((acc, cur) => acc + cur, 0);
    if (totalRatio !== 100) {
      throw new Error(errorMessages.invalidTotalRatio);
    }
    this._targets = props.targets;

    this._memo = props.memo;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get targets() {
    return this._targets;
  }

  get memo() {
    return this._memo;
  }
}

export class Target {
  private _muscle: Muscle;
  private _ratio: number;

  public constructor(props: { muscle: Muscle; ratio: number }) {
    this._muscle = props.muscle;

    if (props.ratio < 0) {
      throw new Error(errorMessages.invalidRatio);
    }
    this._ratio = props.ratio;
  }

  get muscle() {
    return this._muscle;
  }

  get ratio() {
    return this._ratio;
  }
}

export const errorMessages = {
  emptyTargetsArray: "emptyTargetsArray",
  duplicatedTarget: "duplicatedTarget",
  invalidTotalRatio: "invalidTotalRatio",
  invalidRatio: "invalidRatio",
} as const;
