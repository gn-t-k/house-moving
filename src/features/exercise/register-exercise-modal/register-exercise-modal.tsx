import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Select,
} from "@chakra-ui/react";
import { FC, FormEventHandler, MouseEventHandler, useState } from "react";
import { Exercise } from "../exercise";
import { useExerciseForm } from "../use-exercise-form";
import { Muscle } from "@/features/muscle/muscle";

type Props = {
  muscles: Muscle[];
  isOpen: boolean;
  onClose: () => void;
  getMuscleById: (_id: string) => Promise<Muscle>;
  registerExercise: (_exercise: Exercise) => Promise<void>;
};
export const RegisterExerciseModal: FC<Props> = ({
  muscles,
  isOpen,
  onClose,
  getMuscleById,
  registerExercise,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const {
    register,
    errors,
    isValid,
    targetIdList,
    isLastField,
    appendTargetField,
    removeTargetField,
    submit,
  } = useExerciseForm({
    getMuscleById,
    registerExercise,
  });

  const handleAppend: MouseEventHandler<HTMLButtonElement> = (_e) => {
    appendTargetField();
  };
  const handleRemove =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (_e) => {
      removeTargetField(index);
    };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const result = await submit();
    setIsLoading(false);

    if (result.isSuccess) {
      toast({
        title: "登録しました",
        status: "success",
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: result.error.message,
        status: "error",
        isClosable: true,
      });
    }
  };
  const handleCancel: MouseEventHandler<HTMLButtonElement> = (_e) => {
    onClose();
  };

  return (
    <Modal {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isInvalid={errors.name !== undefined}>
              <FormLabel>種目名</FormLabel>
              <Input
                {...register("name", {
                  required: {
                    value: true,
                    message: "入力必須です",
                  },
                })}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.targets?.some(
                (target) => target.ratio !== undefined
              )}
            >
              <FormLabel>部位</FormLabel>
              {targetIdList.map((id, index) => (
                <Stack key={id} direction="row">
                  <Stack direction="column">
                    <FormControl
                      isInvalid={
                        errors.targets?.[index]?.muscleId !== undefined
                      }
                    >
                      <FormLabel>部位{index + 1}</FormLabel>
                      <Select
                        placeholder="未選択"
                        {...register(`targets.${index}.muscleId`, {
                          required: { value: true, message: "入力必須です" },
                        })}
                      >
                        {muscles.map((muscle) => (
                          <option key={muscle.id} value={muscle.id}>
                            {muscle.name}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.targets?.[index]?.muscleId?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel>割合</FormLabel>
                      <InputGroup>
                        <Input
                          {...register(`targets.${index}.ratio`, {
                            required: { value: true, message: "入力必須です" },
                            validate: {
                              number: (value: string) =>
                                /^[0-9]*$/.test(value) ||
                                "数字を入力してください",
                            },
                          })}
                        />
                        <InputRightElement>%</InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </Stack>
                  <Button onClick={handleRemove(index)} disabled={isLastField}>
                    削除
                  </Button>
                </Stack>
              ))}
              <FormErrorMessage>
                {errors.targets?.[0]?.ratio?.message}
              </FormErrorMessage>
              <Button onClick={handleAppend}>追加</Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCancel}>キャンセル</Button>
            <Button type="submit" isDisabled={!isValid}>
              {isLoading ? <Spinner /> : "鍛えたい部位を登録"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
