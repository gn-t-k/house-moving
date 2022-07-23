import { composeStories } from "@storybook/testing-react";
import * as stories from "././register-exercise-modal.stories";

describe("RegisterExerciseModal", () => {
  const Stories = composeStories(stories);
});