import { ActionIcon, Card, Group, Select, Stack, Switch, Tabs, Text, Title } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useAtomValue } from "jotai";

import { settingsAtom } from "~popup/states/atoms";
import { setSettings } from "~storage/settings";
import { removeActionBadgeText, setActionBadgeText } from "~utils/actionBadge";
import { getEntries } from "~utils/storage";
import { capitalize } from "~utils/string";

export const SettingsModalContent = () => {
  const settings = useAtomValue(settingsAtom);
  const systemColorScheme = useColorScheme();

  return (
    <Card>
      <Group align="center" position="apart" mb="xs">
        <Title order={4}>Settings</Title>
        <ActionIcon onClick={() => modals.closeAll()}>
          <IconX size="1rem" />
        </ActionIcon>
      </Group>
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <Stack spacing="xs" p="md">
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
      </Tabs>
    </Card>
  );
};
