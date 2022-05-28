import type { NextPage } from "next";
import { CreateUserForm } from "@/features/user/create-user-form/create-user-form";
import { useCreateUser } from "@/features/user/use-crate-user";

const UserPage: NextPage = () => {
  const { createUser } = useCreateUser();

  return <CreateUserForm createUser={createUser} />;
};

export default UserPage;
