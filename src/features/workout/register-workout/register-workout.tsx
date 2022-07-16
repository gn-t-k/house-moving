import { FC } from "react";
import { useRegisterWorkoutForm } from "./use-register-workout-form";

type Props = {};
export const RegisterWorkout: FC<Props> = (props) => {
  const { control, register } = useRegisterWorkoutForm();
  return <></>;
};
