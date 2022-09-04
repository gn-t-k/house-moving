import { Spinner } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "@/features/auth/use-auth";
import { RegisterMuscleForm } from "@/features/muscle/register-muscle-form/register-muscle-form";
import { useGetMuscleByName } from "@/features/muscle/use-get-muscle-by-name";
import { useRegisterMuscle } from "@/features/muscle/use-register-muscle";
import { Trainee } from "@/features/trainee/trainee";

const RegisterMuscle: NextPage = () => {
  const { getMuscleByName } = useGetMuscleByName();
  const { registerMuscle: registerMuscleHOF } = useRegisterMuscle();

  const [auth] = useAuthState();

  if (auth.status !== "authenticated") {
    return <Spinner />;
  }

  const { session } = auth;

  const buildTraineeResult = Trainee.reconstruct({
    id: session.id,
    name: session.name,
    image: session.image,
  });
  if (!buildTraineeResult.isSuccess) {
    // TODO
    return <p>Sorry, something went wrong</p>;
  }

  const trainee = buildTraineeResult.data;

  const registerMuscle = registerMuscleHOF(trainee);

  return <RegisterMuscleForm {...{ getMuscleByName, registerMuscle }} />;
};

export default RegisterMuscle;
