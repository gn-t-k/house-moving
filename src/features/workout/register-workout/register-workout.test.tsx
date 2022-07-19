import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";
import * as stories from "././register-workout.stories";

describe("RegisterWorkout", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test("「削除」ボタンがdisabledになっている（要素が1つだけ）", () => {
      const deleteButton = screen.getByText<HTMLButtonElement>("削除");

      expect(deleteButton.disabled).toBe(true);
    });
  });
});
