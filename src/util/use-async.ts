import { useReducer } from "react";
import { Async } from "./async";
import { Result } from "./result";

type UseAsync = <T>() => [
  state: Async<T>,
  mutate: { start: () => void; done: (_result: Result<T>) => void }
];
export const useAsync: UseAsync = <T>() => {
  const actions = {
    start: () => ({
      type: "start" as const,
    }),
    done: (result: Result<T>) => ({
      type: "done" as const,
      payload: result,
    }),
  };
  type ActionType = ReturnType<typeof actions[keyof typeof actions]>;
  const reducer = (state: Async<T>, action: ActionType): Async<T> => {
    switch (action.type) {
      case "start":
        return state.status === "idle" || state.status === "done"
          ? { status: "loading" }
          : state;
      case "done":
        return state.status === "loading"
          ? { status: "done", ...action.payload }
          : state;
      default:
        return state;
    }
  };

  const initialState: Async<T> = { status: "idle" };
  const [asyncState, dispatch] = useReducer(reducer, initialState);

  return [
    asyncState,
    {
      start: () => {
        dispatch({ type: "start" });
      },
      done: (result: Result<T>) => {
        dispatch({ type: "done", payload: result });
      },
    },
  ];
};
