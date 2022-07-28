import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as stories from "././register-exercise-modal.stories";

describe("RegisterExerciseModal", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(async () => {
      render(<Stories.Default />);

      const openModalButton = screen.getByText<HTMLButtonElement>("open modal");

      await userEvent.click(openModalButton);
    });

    test("「削除」ボタンがdisabledになっている（削除すると入力項目がなくなってしまうため）", async () => {
      const deleteButton = screen.getByText<HTMLButtonElement>("削除");

      expect(deleteButton.disabled).toBe(true);
    });

    test("「種目を登録」ボタンがdisabledになっている", () => {
      const submitButton = screen.getByText<HTMLButtonElement>("種目を登録");

      expect(submitButton.disabled).toBe(true);
    });
  });

  describe("必須項目を入力して種目を登録", () => {
    const registerExercise = jest.fn();

    beforeEach(async () => {
      registerExercise.mockClear();

      const { container } = render(
        <Stories.必須項目を入力して登録 registerExercise={registerExercise} />
      );

      await Stories.必須項目を入力して登録.play({
        canvasElement: container,
      });
    });

    test("登録関数が呼ばれる", () => {
      expect(registerExercise).toBeCalledTimes(1);
    });
  });
});
