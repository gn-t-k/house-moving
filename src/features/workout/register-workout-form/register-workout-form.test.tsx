import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import * as stories from "./register-workout-form.stories";

describe("RegisterWorkoutForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test("「削除」ボタンがdisabledになっている（要素が1つだけ）", () => {
      const deleteButton = screen.getByText<HTMLButtonElement>("削除");

      expect(deleteButton.disabled).toBe(true);
    });

    test("「ワークアウトを登録」ボタンがdisabledになっている", () => {
      const submitButton =
        screen.getByText<HTMLButtonElement>("ワークアウトを登録");

      expect(submitButton.disabled).toBe(true);
    });
  });

  describe("必須項目を入力してワークアウトを登録", () => {
    const registerWorkout = jest.fn();
    const getExerciseById = async (_id: string) => ({
      id: "exercise-1",
      name: "ベンチプレス",
      targets: [
        {
          muscle: {
            id: "muscle-1",
            name: "大胸筋",
          },
          ratio: 0.5,
        },
        {
          muscle: {
            id: "muscle-2",
            name: "上腕三頭筋",
          },
          ratio: 0.3,
        },
        {
          muscle: {
            id: "muscle-3",
            name: "三角筋前部",
          },
          ratio: 0.2,
        },
      ],
      memo: "",
    });
    const redirectToEditPage = jest.fn();

    beforeEach(async () => {
      registerWorkout.mockClear();
      redirectToEditPage.mockClear();

      const { container } = render(
        <Stories.必須項目を入力してワークアウトを登録
          getExerciseById={getExerciseById}
          registerWorkout={registerWorkout}
          redirectToEditPage={redirectToEditPage}
        />
      );

      await Stories.必須項目を入力してワークアウトを登録.play({
        canvasElement: container,
      });
    });

    test("登録関数が呼ばれる", () => {
      expect(registerWorkout).toBeCalledTimes(1);
    });

    test("リダイレクトする関数が呼ばれる", () => {
      expect(redirectToEditPage).toBeCalledTimes(1);
    });
  });

  describe("重量に不正な値を入力", () => {
    beforeEach(async () => {
      const { container } = render(<Stories.重量に不正な値を入力 />);

      await Stories.重量に不正な値を入力.play({
        canvasElement: container,
      });
    });

    test("エラー文言が表示される", () => {
      const errorMessage = screen.getByText("数字を入力してください");

      expect(errorMessage).toBeInTheDocument;
    });
  });
});
