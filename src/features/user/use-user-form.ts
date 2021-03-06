import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { BloodType, createUser, isBloodType, User } from "./user";
import { useForm } from "@/ui/form/use-form";

type UseUserForm = (props?: { defaultValues: UserField }) => {
  useFormReturn: UseFormReturn<UserField>;
  toUserField: (props: User) => UserField;
  fromUserField: (props: ValidUserField) => User;
  isValidUserField: (props: UserField) => props is ValidUserField;
};

type UserField = {
  name: string;
  tel: string;
  bloodType: string;
};

type ValidUserField = UserField & {
  bloodType: BloodType;
};

export const useUserForm: UseUserForm = (props) => {
  const defaultValues: UserField = {
    name: "",
    tel: "",
    bloodType: "",
  } as const;

  return {
    useFormReturn: useForm<UserField>({
      defaultValues: props?.defaultValues ?? defaultValues,
      mode: "all",
    }),
    toUserField: useCallback(
      (props) => ({
        name: props.name,
        tel: String(props.tel),
        bloodType: props.bloodType === null ? "" : props.bloodType,
      }),
      []
    ),
    fromUserField: useCallback(
      (props) =>
        createUser({
          name: props.name,
          tel: props.tel,
          bloodType: props.bloodType,
        }),
      []
    ),
    isValidUserField: useCallback(
      (props): props is ValidUserField =>
        props.name !== "" &&
        !Number.isNaN(parseInt(props.tel)) &&
        (props.bloodType === "" || isBloodType(props.bloodType)),
      []
    ),
  };
};
