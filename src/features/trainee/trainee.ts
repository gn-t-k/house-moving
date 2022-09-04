import { Result } from "@/util/result";

export class Trainee {
  private _id: string;
  private _name: string;
  private _image: string;

  private constructor(props: { id: string; name: string; image: string }) {
    this._id = props.id;
    this._name = props.name;
    this._image = props.image;
  }

  public static reconstruct = (value: unknown): Result<Trainee> => {
    const props = value as {
      id: string;
      name: string;
      image: string;
    };

    try {
      const isValid =
        !!props &&
        typeof props.id === "string" &&
        typeof props.name === "string" &&
        typeof props.image === "string";

      if (!isValid) {
        throw new Error(errorMessages.buildFailed);
      }

      const trainee = new Trainee({
        id: props.id,
        name: props.name,
        image: props.image,
      });

      return {
        isSuccess: true,
        data: trainee,
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

  get image() {
    return this._image;
  }
}

const errorMessages = {
  buildFailed: "buildFailed",
} as const;
