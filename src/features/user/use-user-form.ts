import { UseFormReturn } from "react-hook-form";
import { bloodType, BloodType, User } from "./user";
import { useForm } from "@/ui/form/use-form";
import { Convert } from "@/util/convert";

type UseUserForm = (props?: { defaultValues: UserField }) => {
  useFormReturn: UseFormReturn<UserField>;
  getUserField: Convert<User, UserField>;
  getUser: Convert<ValidUserField, User>;
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
    getUserField: (props) => ({
      name: props.name,
      tel: String(props.tel),
      bloodType: props.bloodType === null ? "" : props.bloodType,
    }),
    getUser: (props) => ({
      name: props.name,
      tel: props.tel,
      bloodType: props.bloodType,
    }),
    isValidUserField: (props): props is ValidUserField =>
      props.name !== "" &&
      !Number.isNaN(parseInt(props.tel)) &&
      (props.bloodType === "" ||
        Object.values(bloodType).some((v) => props.bloodType === v)),
  };
};
