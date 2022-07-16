import { composeStories } from "@storybook/testing-react";
import * as stories from "././register-workout.stories";

describe("RegisterWorkout", () => {
  const Stories = composeStories(stories);
});