import { Muscle } from "./muscle";
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

      if (result.data === null) {
        return {
          isSuccess: true,
          data: result.data,
        };
      }

      const buildMuscleResult = Muscle.build(result.data);
      if (!buildMuscleResult.isSuccess) {
        throw new Error(
          "取得した情報を正しく処理できませんでした。開発者にお問い合わせください。"
        );
      }

      const muscle = buildMuscleResult.data;

      return {
        isSuccess: true,
        data: muscle,
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
