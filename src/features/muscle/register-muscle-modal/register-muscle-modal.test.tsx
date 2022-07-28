import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as stories from "././register-muscle-modal.stories";

describe("RegisterMuscleModal", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(async () => {
      render(<Stories.Default />);

      const openModalButton = screen.getByText<HTMLButtonElement>("open modal");

      await userEvent.click(openModalButton);
    });

    test("「鍛えたい部位を登録」ボタンがdisabledになっている（部位名未入力のため）", async () => {
      const muscleNameInput =
        screen.getByText<HTMLInputElement>("鍛えたい部位を登録");

      expect(muscleNameInput.disabled).toBe(true);
    });
  });

  describe("部位名を入力して消去", () => {
    beforeEach(async () => {
      const { container } = render(<Stories.部位名を入力して消去 />);

      await Stories.部位名を入力して消去.play({ canvasElement: container });
    });

    test("エラー文言が表示される", () => {
      const errorMessage = screen.getByText("部位名が入力されていません");

      expect(errorMessage).toBeInTheDocument;
    });
  });
});
