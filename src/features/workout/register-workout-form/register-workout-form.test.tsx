import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import * as stories from "./register-workout-form.stories";

describe("RegisterWorkoutForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test("「削除」ボタンがdisabledになっている（削除すると入力項目がなくなってしまうため）", async () => {
      const deleteButton = screen.getByText<HTMLButtonElement>("種目1を削除");

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
    const redirectToEditPage = jest.fn();

    beforeEach(async () => {
      registerWorkout.mockClear();
      redirectToEditPage.mockClear();

      const { container } = render(
        <Stories.必須項目を入力してワークアウトを登録
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
