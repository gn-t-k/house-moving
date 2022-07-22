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
  Input,
  useToast,
} from "@chakra-ui/react";
import { MouseEventHandler, FC, FormEventHandler, useState } from "react";
import { Muscle } from "../muscle";
import { useMuscleForm } from "../use-muscle-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  registerMuscle: (_muscle: Muscle) => Promise<void>;
  isSameNameMuscleExist: (_muscle: Muscle) => Promise<boolean>;
};
export const RegisterMuscleModal: FC<Props> = ({
  isOpen,
  onClose,
  registerMuscle,
  isSameNameMuscleExist,
}) => {
  const { register, errors, isValid, submit } = useMuscleForm({
    registerMuscle,
    isSameNameMuscleExist,
  });
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (_e) => {
    onClose();
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

  return (
    <Modal {...{ isOpen, onClose }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>鍛えたい部位を登録する</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl isInvalid={errors.name !== undefined}>
              <FormLabel>部位名</FormLabel>
              <Input
                {...register(`name`, {
                  required: {
                    value: true,
                    message: "部位名が入力されていません",
                  },
                })}
              />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
