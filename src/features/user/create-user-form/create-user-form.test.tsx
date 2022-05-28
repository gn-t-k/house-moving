import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { createUserID, UserID } from "../user";
import * as stories from "./create-user-form.stories";
import { Result } from "@/util/result";

describe("CreateUserForm", () => {
  const Stories = composeStories(stories);

  test("ボタンをクリックすると、ユーザー作成のリクエストを送信する", async () => {
    const createUser = jest.fn();
    const onClick = (): Promise<Result<UserID>> => {
      createUser();

      return Promise.resolve({
        isSuccess: true,
        data: createUserID("userID"),
      });
    };

    const { container } = render(
      <Stories.EntryAndSubmit createUser={onClick} />
    );

    await act(async () => {
      await Stories.EntryAndSubmit.play({ canvasElement: container });
    });

    expect(createUser).toBeCalledTimes(1);
  });
});
