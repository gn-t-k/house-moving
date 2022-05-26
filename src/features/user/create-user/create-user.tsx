import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import { FC } from "react";
import { useCreateUser } from "../use-crate-user";
import { useUserForm } from "../use-user-form";
import { bloodType, User } from "../user";
import { Result } from "@/util/result";

export const CreateUser: FC = () => {
  const { createUser } = useCreateUser();

  return <CreateUserView onClick={createUser} />;
};

export const CreateUserView: FC<{
  onClick: (user: User) => Promise<Result<void>>;
}> = (props) => {
  const {
    useFormReturn: { register, formState, handleSubmit, getValues },
    getUser,
    isValidUserField,
  } = useUserForm();

  const onSubmit = handleSubmit(async () => {
    const userField = getValues();

    if (isValidUserField(userField)) {
      const result = await props.onClick(getUser(userField));

      if (result.isSuccess) {
        console.info(result);
      } else {
        console.error(result.failure.message);
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl isInvalid={formState.errors.name !== undefined}>
        <FormLabel>名前</FormLabel>
        <Input
          {...register("name", {
            required: "名前は入力必須です",
          })}
        />
        {formState.errors.name && (
          <FormErrorMessage>{formState.errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={formState.errors.tel !== undefined}>
        <FormLabel>電話番号</FormLabel>
        <Input
          {...register("tel", {
            required: "電話番号は入力必須です",
            pattern: {
              value: /[0-9]/,
              message: "数字を入力してください",
            },
            minLength: {
              value: 10,
              message: "電話番号は10文字以上入力してください",
            },
            maxLength: {
              value: 11,
              message: "電話番号は11文字以下で入力してください",
            },
          })}
        />
        {formState.errors.tel && (
          <FormErrorMessage>{formState.errors.tel.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={formState.errors.bloodType !== undefined}>
        <FormLabel>血液型</FormLabel>
        <Select {...register("bloodType")}>
          {Object.values(bloodType).map((bloodType) => (
            <option key={bloodType} value={bloodType}>
              {bloodType}
            </option>
          ))}
        </Select>
        {formState.errors.bloodType && (
          <FormErrorMessage>
            {formState.errors.bloodType.message}
          </FormErrorMessage>
        )}
      </FormControl>
      <Button type="submit" isDisabled={!formState.isValid}>
        create user
      </Button>
    </form>
  );
};
