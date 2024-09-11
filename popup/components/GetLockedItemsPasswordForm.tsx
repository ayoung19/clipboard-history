import { createHash } from "crypto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Space, Text, TextInput } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useModal } from "~popup/hooks/useModal";
import { lockedReversedEntriesAtom } from "~popup/state/atoms";
import { decryptEntry, passwordToKey } from "~utils/crypto";

interface Props {
  onSubmit: (oldKey: string) => void;
}

export const GetLockedItemsPasswordForm = ({ onSubmit }: Props) => {
  const { closeModal } = useModal();
  const lockedReversedEntries = useAtomValue(lockedReversedEntriesAtom);

  const schema = z
    .object({
      password: z.string(),
    })
    .superRefine(({ password }, ctx) => {
      try {
        lockedReversedEntries.forEach((entry) => decryptEntry(passwordToKey(password), entry));
      } catch {
        ctx.addIssue({
          code: "custom",
          message: "Wrong password",
          path: ["password"],
        });
      }
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      password: "",
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
      <Text fz="xs">A password is required to access or modify locked entries.</Text>
      <Space h={4} />
      <TextInput
        {...register("password")}
        label="Password"
        error={errors.password?.message}
        type="password"
        size="xs"
      />
      <Space h="md" />
      <Group align="center" position="right">
        <Button type="submit" size="xs" color="indigo">
          Continue
        </Button>
      </Group>
    </form>
  );
};
