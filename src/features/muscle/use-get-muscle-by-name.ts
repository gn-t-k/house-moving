import { Muscle, isMuscle } from "./muscle";
import { Result, isResult } from "@/util/result";

type GetMuscleByName = (_name: string) => Promise<Result<Muscle | null>>;

type UseGetMuscleByName = () => {
  getMuscleByName: GetMuscleByName;
};
export const useGetMuscleByName: UseGetMuscleByName = () => {
  const getMuscleByName: GetMuscleByName = async (name) => {
    try {
      const response = await fetch(`/api/muscles/?name=${name}`);

      const result = await response.json();

      if (!(isResult(result) && result.isSuccess)) {
        throw new Error(
          "情報を正しく取得できませんでした。開発者にお問い合わせください。"
        );
      }

      if (!isMuscle(result.data) && result.data !== null) {
        throw new Error(
          "取得した情報を正しく処理できませんでした。開発者にお問い合わせください。"
        );
      }

      return {
        isSuccess: true,
        data: result.data,
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

  return {
    getMuscleByName,
  };
};
