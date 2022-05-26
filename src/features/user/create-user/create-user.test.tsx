import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import * as stories from "./create-user.stories";

describe("CreateUser", () => {
  const Stories = composeStories(stories);

  test("ボタンをクリックすると、ユーザー作成のリクエストを送信する", async () => {
    const createUser = jest.fn();

    const { container } = render(<Stories.ClickButton onClick={createUser} />);
    await Stories.ClickButton.play({ canvasElement: container });

    expect(createUser).toBeCalledTimes(1);
  });
});
