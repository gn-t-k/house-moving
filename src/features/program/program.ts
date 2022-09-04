import { ulid } from "ulid";
import { Exercise } from "../exercise/exercise";
import { hasAtLeastOne } from "@/util/has-at-least-one";
import { Result } from "@/util/result";

export type Programs = {
  id: string;
  name: string;
  contents: Contents[];
  memo: string;
};

type Contents = {
  exercise: Exercise;
  repetition: number;
  set: number;
};

export class Program {
  private _id: string;
  private _name: string;
  private _contents: Content[];
  private _memo: string;

  private constructor(props: {
    id: string;
    name: string;
    contents: Content[];
    memo: string;
  }) {
    this._id = props.id;

    this._name = props.name;

    if (!hasAtLeastOne(props.contents)) {
      throw new Error(errorMessages.emptyContents);
    }
    this._contents = props.contents;

    this._memo = props.memo;
  }

  public static build = (props: {
    name: string;
    contents: Content[];
    memo: string;
  }): Result<Program> => {
    try {
      const program = new Program({
        id: ulid(),
        name: props.name,
        contents: props.contents,
        memo: props.memo,
      });

      return {
        isSuccess: true,
        data: program,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: {
          message:
            error instanceof Error ? error.message : errorMessages.buildFailed,
        },
      };
    }
  };

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get contents() {
    return this._contents;
  }

  get memo() {
    return this._memo;
  }
}

export class Content {
  private _exercise: Exercise;
  private _repetition: number;
  private _set: number;

  public constructor(props: {
    exercise: Exercise;
    repetition: number;
    set: number;
  }) {
    this._exercise = props.exercise;

    if (props.repetition < 0) {
      throw new Error(errorMessages.invalidRepetition);
    }
    this._repetition = props.repetition;

    if (props.set < 0) {
      throw new Error(errorMessages.invalidSet);
    }
    this._set = props.set;
  }

  get exercise() {
    return this._exercise;
  }

  get repetition() {
    return this._repetition;
  }

  get set() {
    return this._set;
  }
}

const errorMessages = {
  emptyContents: "emptyContents",
  invalidRepetition: "invalidRepetition",
  invalidSet: "invalidSet",
  buildFailed: "buildFailed",
} as const;
