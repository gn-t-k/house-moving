import { Trainee } from "../trainee/trainee";
import { Muscle } from "./muscle";
import { Result, isResult } from "@/util/result";

type RegisterMuscle = (
  _trainee: Trainee
) => (_muscle: Muscle) => Promise<Result<void>>;

type UseRegisterMuscle = () => {
  registerMuscle: RegisterMuscle;
};
export const useRegisterMuscle: UseRegisterMuscle = () => {
  const registerMuscle: RegisterMuscle = (trainee) => async (muscle) => {
    try {
      const body = {
        muscle,
        trainee,
      };
      const response = await fetch("/api/muscles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!(isResult(result) && result.isSuccess)) {
        throw new Error(
          "情報を正しく取得できませんでした。開発者にお問い合わせください。"
        );
      }

      return {
        isSuccess: true,
        data: void 0,
      };
    } catch (error) {
      return {
        isSuccess: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "不明なエラーが発生しました。開発者にお問い合わせください。",
        },
      };
    }
  };

  return { registerMuscle };
};
