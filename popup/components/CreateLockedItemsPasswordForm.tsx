import { createHash } from "crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Space, Text, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useModal } from "~popup/hooks/useModal";

const schema = z
  .object({
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });

interface Props {
  onSubmit: (newKey: string) => void;
}

export const CreateLockedItemsPasswordForm = ({ onSubmit }: Props) => {
  const { closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(createHash("sha256").update(data.password).digest("base64"));
        closeModal();
      })}
    >
      <Text fz="xs">
        Create a password for encrypting your locked clipboard items. This password will be required
        to access or modify locked entries. Ensure it's memorable, as locked items cannot be
        recovered if the password is lost.
      </Text>
      <Space h={4} />
      <TextInput
        {...register("password")}
        label="Password"
        error={errors.password?.message}
        type="password"
        size="xs"
      />
      <TextInput
        {...register("confirmPassword")}
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        type="password"
        size="xs"
      />
      <Space h="md" />
      <Group align="center" position="right">
        <Button type="submit" size="xs" color="indigo">
          Set Password
        </Button>
      </Group>
    </form>
  );
};
