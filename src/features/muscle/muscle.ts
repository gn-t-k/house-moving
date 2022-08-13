import { ulid } from "ulid";
import { Result } from "@/util/result";

export class Muscle {
  private _id: string;
  private _name: string;

  public constructor(props: { id?: string; name: string }) {
    this._id = props.id ?? ulid();
    this._name = props.name;
  }

  public static build = (value: unknown): Result<Muscle> => {
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
  buildFailed: "buildFailed",
} as const;
