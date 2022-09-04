import { ulid } from "ulid";
import { Result } from "@/util/result";

export class Muscle {
  private _id: string;
  private _name: string;

  private constructor(props: { id: string; name: string }) {
    this._id = props.id;

    if (props.name === "") {
      throw new Error(errorMessages.emptyName);
    }
    this._name = props.name;
  }

  public static build = (props: { name: string }): Result<Muscle> => {
    try {
      const muscle = new Muscle({ id: ulid(), name: props.name });

      return {
        isSuccess: true,
        data: muscle,
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

  public static reconstruct = (value: unknown): Result<Muscle> => {
    const props = value as {
      id: string;
      name: string;
    };

    try {
      const isValid =
        !!props &&
        typeof props.id === "string" &&
        typeof props.name === "string";

      if (!isValid) {
        throw new Error(errorMessages.buildFailed);
      }

      const muscle = new Muscle({ id: props.id, name: props.name });

      return {
        isSuccess: true,
        data: muscle,
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
}

export const errorMessages = {
  emptyName: "emptyName",
  buildFailed: "buildFailed",
} as const;
