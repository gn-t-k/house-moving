import { ulid } from "ulid";
import { Exercise } from "../exercise/exercise";
import { Trainee } from "../trainee/trainee";
import { hasAtLeastOne } from "@/util/has-at-least-one";
import { Result } from "@/util/result";

export class Workout {
  private _id: string;
  private _trainee: Trainee;
  private _records: Record[];
  private _date: Date;
  private _memo: string;

  private constructor(props: {
    id: string;
    trainee: Trainee;
    records: Record[];
    date: Date;
    memo: string;
  }) {
    this._id = props.id;

    this._trainee = props.trainee;

    if (!hasAtLeastOne(props.records)) {
      throw new Error(errorMessages.emptyRecords);
    }
    this._records = props.records;

    this._date = props.date;

    this._memo = props.memo;
  }

  public static build = (props: {
    trainee: Trainee;
    records: Record[];
    date: Date;
    memo: string;
  }): Result<Workout> => {
    try {
      const workout = new Workout({
        id: ulid(),
        trainee: props.trainee,
        records: props.records,
        date: props.date,
        memo: props.memo,
      });

      return {
        isSuccess: true,
        data: workout,
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

  get trainee() {
    return this._trainee;
  }

  get records() {
    return this._records;
  }

  get date() {
    return this._date;
  }

  get memo() {
    return this._memo;
  }
}

export class Record {
  private _exercise: Exercise;
  private _weight: number;
  private _repetition: number;

  private constructor(props: {
    exercise: Exercise;
    weight: number;
    repetition: number;
  }) {
    this._exercise = props.exercise;

    if (props.weight < 0) {
      throw new Error(errorMessages.invalidWeight);
    }
    this._weight = props.weight;

    if (props.repetition < 0) {
      throw new Error(errorMessages.invalidRepetition);
    }
    this._repetition = props.repetition;
  }

  public static build = (props: {
    exercise: Exercise;
    weight: number;
    repetition: number;
  }): Result<Record> => {
    try {
      const record = new Record({
        exercise: props.exercise,
        weight: props.weight,
        repetition: props.repetition,
      });

      return {
        isSuccess: true,
        data: record,
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

  get exercise() {
    return this._exercise;
  }

  get weight() {
    return this._weight;
  }

  get repetition() {
    return this._repetition;
  }
}

const errorMessages = {
  emptyRecords: "emptyRecords",
  invalidWeight: "invalidWeight",
  invalidRepetition: "invalidRepetition",
  buildFailed: "buildFailed",
} as const;
