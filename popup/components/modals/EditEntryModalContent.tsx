import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CloseButton,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconAlertTriangle } from "@tabler/icons-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { handleMutation } from "~popup/utils/mutation";
import type { Entry } from "~types/entry";
import db from "~utils/db/react";
import { getEntryCopiedAt } from "~utils/entries";
import { updateEntryContent } from "~utils/storage";
import { lightOrDark } from "~utils/sx";

import { EntryDeleteAction } from "../EntryDeleteAction";
import { EntryFavoriteAction } from "../EntryFavoriteAction";

const schema = z.object({
  content: z.string(),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  entry: Entry;
}

export const EditEntryModalContent = ({ entry }: Props) => {
  const theme = useMantineTheme();

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      content: entry.content,
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();

  useEffect(() => {
    if (entry.id.length === 36 && auth.user && connectionStatus === "closed") {
      modals.closeAll();
    }
  }, [entry.id.length === 36 && auth.user && connectionStatus === "closed"]);

  return (
    <Paper p="md">
      <Group align="center" position="apart" mb="xs">
        <Title order={5}>{chrome.i18n.getMessage("editModalTitle")}</Title>
        <CloseButton onClick={() => modals.closeAll()} />
      </Group>
      <Grid gutter={0}>
        <Grid.Col span={4}>
          <Text size="xs" color="dimmed">
            {chrome.i18n.getMessage("editModalCharCount")}
          </Text>
          <Text size="xs">{entry.content.length}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text size="xs" color="dimmed">
            {chrome.i18n.getMessage("editModalDateCreated")}
          </Text>
          <Text size="xs">{format(entry.createdAt, "Pp")}</Text>
        </Grid.Col>
        <Grid.Col span={4}>
          <Text size="xs" color="dimmed">
            {chrome.i18n.getMessage("editModalDateCopied")}
          </Text>
          <Text size="xs">{format(getEntryCopiedAt(entry), "Pp")}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <form
            onSubmit={handleSubmit(async ({ content }) => {
              const { ok } = await handleMutation(() => updateEntryContent(entry.id, content))();

              if (ok) {
                modals.closeAll();
              } else {
                setError("content", { type: "manual", message: chrome.i18n.getMessage("editModalUniqueError") });
              }
            })}
          >
            <Stack spacing="xs">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label={
                      <Text size="xs" color="dimmed" fw="normal">
                        {chrome.i18n.getMessage("editModalContentLabel")}
                      </Text>
                    }
                    autosize
                    maxRows={16}
                    size="xs"
                    error={errors.content?.message}
                  />
                )}
              />
              <Group align="center" position="apart">
                <Text
                  size="xs"
                  color={lightOrDark(theme, "orange", "yellow")}
                  display="flex"
                  align="center"
                >
                  {isDirty && (
                    <>
                      <IconAlertTriangle size="1.125rem" />
                      <Text ml={4}>{chrome.i18n.getMessage("commonUnsavedChanges")}</Text>
                    </>
                  )}
                </Text>
                <Group align="center" spacing="xs">
                  <EntryFavoriteAction entryId={entry.id} />
                  <EntryDeleteAction entryId={entry.id} />
                  <Button size="xs" variant="subtle" disabled={!isDirty} onClick={() => reset()}>
                    {chrome.i18n.getMessage("commonReset")}
                  </Button>
                  <Button
                    size="xs"
                    disabled={!isDirty || !isValid}
                    type="submit"
                    loading={isSubmitting}
                  >
                    {chrome.i18n.getMessage("commonSave")}
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
