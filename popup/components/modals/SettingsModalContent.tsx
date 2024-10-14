import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CloseButton,
  Divider,
  Group,
  Indicator,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconDatabase,
  IconX,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { settingsAtom } from "~popup/states/atoms";
import { setSettings } from "~storage/settings";
import { removeActionBadgeText, setActionBadgeText } from "~utils/actionBadge";
import { getEntries } from "~utils/storage";
import { capitalize } from "~utils/string";
import { defaultBorderColor, lightOrDark } from "~utils/sx";

const schema = z.object({
  localItemLimit: z.number().min(1).nullable(),
});
type FormValues = z.infer<typeof schema>;

export const SettingsModalContent = () => {
  const theme = useMantineTheme();
  const settings = useAtomValue(settingsAtom);
  const systemColorScheme = useColorScheme();

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      localItemLimit: settings.localItemLimit,
    },
    mode: "all",
    resolver: zodResolver(schema),
  });

  return (
    <Paper p="md">
      <Group align="center" position="apart" mb="xs">
        <Title order={5}>Settings</Title>
        <CloseButton onClick={() => modals.closeAll()} />
      </Group>
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general" icon={<IconAdjustmentsHorizontal size="0.8rem" />}>
            General
          </Tabs.Tab>
          <Tabs.Tab
            value="storage"
            icon={
              <Indicator
                color={lightOrDark(theme, "orange", "yellow")}
                size={8}
                disabled={!isDirty}
              >
                <IconDatabase size="0.8rem" />
              </Indicator>
            }
          >
            Storage
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <Stack p="md">
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>Total Items Badge</Title>
                <Text fz="xs">
                  Show number of items in the clipboard history on the extension icon.
                </Text>
              </Stack>
              <Switch
                checked={settings.totalItemsBadge}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await Promise.all([
                    checked
                      ? setActionBadgeText((await getEntries()).length)
                      : removeActionBadgeText(),
                    setSettings({ ...settings, totalItemsBadge: checked }),
                  ]);
                }}
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>Blank Items</Title>
                <Text fz="xs">Allow blank items to be added to the clipboard history.</Text>
              </Stack>
              <Switch
                checked={settings.allowBlankItems}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await setSettings({ ...settings, allowBlankItems: checked });
                }}
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>Theme</Title>
                <Text fz="xs">Select the extension's color scheme.</Text>
              </Stack>
              <Select
                value={settings.themeV2}
                onChange={(theme) => theme && setSettings({ ...settings, themeV2: theme })}
                data={[
                  { value: "system", label: `System (${capitalize(systemColorScheme)})` },
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
                size="xs"
                withinPortal
              />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="storage">
          <form
            onSubmit={handleSubmit(async ({ localItemLimit }) => {
              await setSettings({ ...settings, localItemLimit });
              reset({ localItemLimit });
            })}
          >
            <Stack p="md">
              <Stack spacing="xs">
                <Group align="flex-start" position="apart" noWrap>
                  <Stack spacing={0}>
                    <Title order={6}>Item Limit</Title>
                    <Text fz="xs">
                      Set the maximum number of non-favorited items that the clipboard history will
                      store.
                    </Text>
                  </Stack>
                  <Switch
                    checked={watch("localItemLimit") !== null}
                    onChange={(e) =>
                      setValue(
                        "localItemLimit",
                        e.target.checked ? settings.localItemLimit || 150 : null,
                        {
                          shouldDirty: true,
                        },
                      )
                    }
                  />
                </Group>
                <Controller
                  name="localItemLimit"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(value) => (value === "" ? null : field.onChange(value))}
                      error={errors.localItemLimit?.message}
                      disabled={field.value === null}
                      size="xs"
                    />
                  )}
                />
              </Stack>
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
                      <Text ml={4}>You have unsaved changes.</Text>
                    </>
                  )}
                </Text>
                <Group align="center" spacing="xs">
                  <Button size="xs" variant="subtle" disabled={!isDirty} onClick={() => reset()}>
                    Reset
                  </Button>
                  <Button size="xs" disabled={!isDirty} type="submit">
                    Save
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
