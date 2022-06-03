import {
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FC } from "react";
import { useUserForm } from "../use-user-form";
import { bloodType, User, UserID } from "../user";

type Props = {
  createUser: (user: User) => Promise<void>;
  error: string | null;
  createdUserID: UserID | null;
};

export const CreateUserForm: FC<Props> = (props) => {
  const {
    useFormReturn: { register, formState, handleSubmit, getValues },
    fromUserField,
    isValidUserField,
  } = useUserForm();
  const toast = useToast();

  const onSubmit = handleSubmit(async () => {
    const userField = getValues();

    if (isValidUserField(userField)) {
      await props.createUser(fromUserField(userField));

      toast(
        props.error === null
          ? {
              title: "success",
              description: `user created: ${
                props.createdUserID !== null
                  ? // FIXME: 必ずunknownになる
                    props.createdUserID.value
                  : "unknown user"
              }`,
              status: "success",
            }
          : {
              title: "failure",
              description: `create user failed: ${props.error}`,
              status: "error",
            }
      );
    } else {
      toast({
        title: "failure",
        description: "sorry, something went wrong",
        status: "error",
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <FormControl isInvalid={formState.errors.name !== undefined}>
        <FormLabel htmlFor="name">名前</FormLabel>
        <Input
          id="name"
          {...register("name", {
            required: "名前は入力必須です",
          })}
        />
        {formState.errors.name && (
          <FormErrorMessage>{formState.errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={formState.errors.tel !== undefined}>
        <FormLabel htmlFor="tel">電話番号</FormLabel>
        <Input
          id="tel"
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
        <FormLabel htmlFor="bloodType">血液型</FormLabel>
        <Select id="bloodType" {...register("bloodType")}>
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
      <Button
        aria-labelledby="userSubmitButton"
        type="submit"
        isDisabled={!formState.isValid}
      >
        <Text id="userSubmitButton">create user</Text>
      </Button>
    </form>
  );
};
