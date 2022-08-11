import { NextPage } from "next";
import { useAuthState } from "@/features/auth/use-auth";
import { isMuscle, Muscle } from "@/features/muscle/muscle";
import { RegisterMuscleForm } from "@/features/muscle/register-muscle-form/register-muscle-form";
import { Trainee } from "@/features/trainee/trainee";
import { isResult } from "@/util/api-routes-types/is-result";
import { Result } from "@/util/result";

const RegisterMuscle: NextPage = () => {
  const [auth] = useAuthState();

  if (auth.status !== "authenticated") {
    return null;
  }

  const { session } = auth;
  const trainee: Trainee = {
    id: session.id,
    name: session.name,
    image: session.image,
  };

  type GetMuscleByName = (_name: string) => Promise<Result<Muscle | null>>;
  const getMuscleByName: GetMuscleByName = async (name) => {
    try {
      const response = await fetch(`/api/muscles/?name=${name}`);

      const result = await response.json();

      if (!(isResult(result) && result.isSuccess)) {
        throw new Error("エラーが発生しました");
      }

      if (result.data === null) {
        return {
          isSuccess: true,
          data: null,
        };
      }

      if (!isMuscle(result.data)) {
        throw new Error("エラーが発生しました");
      }

      const muscle: Muscle = result.data;

      return {
        isSuccess: true,
        data: muscle,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: {
          message:
            error instanceof Error ? error.message : "エラーが発生しました",
        },
      };
    }
  };

  type RegisterMuscle = (_muscle: Muscle) => Promise<Result<void>>;
  const registerMuscle: RegisterMuscle = async (muscle) => {
    const body = {
      muscle,
      trainee,
    };
    const result = await fetch("/api/muscles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!(isResult(result) && result.isSuccess)) {
      return {
        isSuccess: false,
        error: {
          message: "エラーが発生しました",
        },
      };
    }

    return {
      isSuccess: true,
      data: void 0,
    };
  };

  return <RegisterMuscleForm {...{ getMuscleByName, registerMuscle }} />;
};

export default RegisterMuscle;
