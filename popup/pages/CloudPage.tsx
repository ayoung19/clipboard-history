import { zodResolver } from "@hookform/resolvers/zod";
import { id } from "@instantdb/core";
import { Anchor, Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { EntryList } from "~popup/components/EntryList";
import { settingsAtom } from "~popup/states/atoms";
import { setSettings } from "~storage/settings";
import db from "~utils/db";

const schema = z.object({
  email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;

export const CloudPage = () => {
  const settings = useAtomValue(settingsAtom);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: settings._email || "",
    },
    resolver: zodResolver(schema),
  });

  return (
    <EntryList
      noEntriesOverlay={
        <Stack align="center" spacing="xs" p="xl">
          <Title order={4}>Sync Your Clipboard History Everywhere - Coming Soon</Title>
          <Text size="sm" w={500} align="center">
            Privately and securely sync your clipboard history across all your devices. Be the first
            to know when clipboard syncing launches!
          </Text>
          {settings._email === null ? (
            <form
              onSubmit={handleSubmit(async ({ email }) => {
                await Promise.all([
                  setSettings({ ...settings, _email: email }),
                  db.transact(db.tx.emails[id()]!.update({ value: email })),
                ]);

                reset({ email });
              })}
            >
              <Group align="start" spacing="xs" mt="xs">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      w={200}
                      size="xs"
                      placeholder="Enter your email address"
                      error={errors.email?.message}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  )}
                />
                <Button type="submit" size="xs" loading={isSubmitting}>
                  Notify Me
                </Button>
              </Group>
            </form>
          ) : (
            <Group align="center" spacing="xs" noWrap>
              <Text size="xs" w={600} align="center">
                You're on the list! 🎉 We'll notify <b>{settings._email}</b> when clipboard history
                syncing launches. Wrong email? Click
                <> </>
                <Anchor
                  component="button"
                  onClick={() => setSettings({ ...settings, _email: null })}
                >
                  here
                </Anchor>
                <> </>
                to change it.
              </Text>
            </Group>
          )}
        </Stack>
      }
      entries={[]}
    />
  );
};
