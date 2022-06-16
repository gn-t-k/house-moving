import { Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { CreateUserForm } from "@/features/user/create-user-form/create-user-form";
import { useCreateUser } from "@/features/user/use-create-user";

const CreateUserPage: NextPage = () => {
  const { createUser, isLoading, createdUserID, error } = useCreateUser();

  return isLoading ? (
    <Text>Loading</Text>
  ) : (
    <CreateUserForm {...{ createUser, error, createdUserID }} />
  );
};

export default CreateUserPage;
