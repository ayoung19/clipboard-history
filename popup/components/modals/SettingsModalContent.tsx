import { zodResolver } from "@hookform/resolvers/zod";
import { id } from "@instantdb/react";
import {
  Badge,
  Box,
  Button,
  CloseButton,
  Divider,
  FileInput,
  Group,
  Indicator,
  NumberInput,
  Paper,
  rem,
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
import { notifications } from "@mantine/notifications";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconAppWindow,
  IconCloud,
  IconDatabase,
  IconDeviceFloppy,
  IconExternalLink,
  IconFileExport,
  IconFileImport,
  IconUpload,
  IconWifiOff,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { sendToBackground } from "@plasmohq/messaging";

import type {
  UpdateContextMenusRequestBody,
  UpdateContextMenusResponseBody,
} from "~background/messages/updateContextMenus";
import type {
  UpdateTotalItemsBadgeRequestBody,
  UpdateTotalItemsBadgeResponseBody,
} from "~background/messages/updateTotalItemsBadge";
import { ShortcutBadge } from "~popup/components/ShortcutBadge";
import { useSettingsQuery } from "~popup/hooks/useSettingsQuery";
import { useSubscriptionsQuery } from "~popup/hooks/useSubscriptionsQuery";
import { commandsAtom, settingsAtom } from "~popup/states/atoms";
import { setSettings } from "~storage/settings";
import { DisplayMode } from "~types/displayMode";
import { ItemSortOption } from "~types/itemSortOption";
import { StorageLocation } from "~types/storageLocation";
import { Tab } from "~types/tab";
import { resolveCloudSettings } from "~utils/cloudSettings";
import db from "~utils/db/react";
import { getClipboardHistoryIOExport, importFile } from "~utils/importExport";
import { capitalize } from "~utils/string";
import { defaultBorderColor, lightOrDark } from "~utils/sx";

const storageSchema = z.object({
  localItemLimit: z.number().min(1).nullable(),
  localItemCharacterLimit: z.number().min(1).nullable(),
});
type StorageFormValues = z.infer<typeof storageSchema>;

const cloudSchema = z.object({
  cloudItemLimit: z.number().min(1).nullable(),
});
type CloudFormValues = z.infer<typeof cloudSchema>;

export const SettingsModalContent = () => {
  const theme = useMantineTheme();
  const auth = db.useAuth();
  const connectionStatus = db.useConnectionStatus();
  const settings = useAtomValue(settingsAtom);
  const commands = useAtomValue(commandsAtom);
  const systemColorScheme = useColorScheme();
  const subscriptionsQuery = useSubscriptionsQuery();
  const settingsQuery = useSettingsQuery();
  const cloudSettings = settingsQuery.data?.settings[0];

  const [file, setFile] = useState<File | null>(null);

  const storageForm = useForm<StorageFormValues>({
    defaultValues: {
      localItemLimit: settings.localItemLimit,
      localItemCharacterLimit: settings.localItemCharacterLimit,
    },
    mode: "all",
    resolver: zodResolver(storageSchema),
  });

  const cloudForm = useForm<CloudFormValues>({
    defaultValues: resolveCloudSettings(cloudSettings),
    mode: "all",
    resolver: zodResolver(cloudSchema),
  });

  return (
    <Paper p="md">
      <Group align="center" position="apart" mb="xs">
        <Title order={5}>{chrome.i18n.getMessage("settingsModalTitle")}</Title>
        <CloseButton onClick={() => modals.closeAll()} />
      </Group>
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general" icon={<IconAdjustmentsHorizontal size="0.8rem" />}>
            {chrome.i18n.getMessage("settingsTabGeneral")}
          </Tabs.Tab>
          <Tabs.Tab value="interface" icon={<IconAppWindow size="0.8rem" />}>
            {chrome.i18n.getMessage("settingsTabInterface")}
          </Tabs.Tab>
          <Tabs.Tab
            value="storage"
            icon={
              <Indicator
                color={lightOrDark(theme, "orange", "yellow")}
                size={8}
                disabled={!storageForm.formState.isDirty}
                offset={1}
              >
                <Box mt={rem(1)}>
                  <IconDatabase size="0.8rem" />
                </Box>
              </Indicator>
            }
          >
            {chrome.i18n.getMessage("settingsTabStorage")}
          </Tabs.Tab>
          <Tabs.Tab value="import-export" icon={<IconDeviceFloppy size="0.8rem" />}>
            {chrome.i18n.getMessage("settingsTabImportExport")}
          </Tabs.Tab>
          <Tabs.Tab
            value="cloud"
            icon={
              <Indicator
                color={lightOrDark(theme, "orange", "yellow")}
                size={8}
                disabled={!cloudForm.formState.isDirty}
                offset={1}
              >
                <Box mt={rem(1)}>
                  <IconCloud size="0.8rem" />
                </Box>
              </Indicator>
            }
          >
            {chrome.i18n.getMessage("settingsTabCloud")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <Stack p="md">
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsShortcutTitle")}</Title>
                <Group align="center" spacing={4}>
                  <Text fz="xs">{chrome.i18n.getMessage("settingsShortcutPress")}</Text>
                  <ShortcutBadge
                    shortcut={
                      commands.find(
                        (command) =>
                          command.name ===
                          (process.env.PLASMO_TARGET === "firefox-mv2"
                            ? "_execute_browser_action"
                            : "_execute_action"),
                      )?.shortcut || chrome.i18n.getMessage("shortcutsModalNotSet")
                    }
                  />
                  <Text fz="xs">{chrome.i18n.getMessage("settingsShortcutToOpen")}</Text>
                </Group>
              </Stack>
              <Button
                size="xs"
                rightIcon={<IconExternalLink size="0.8rem" />}
                onClick={async () => {
                  await chrome.tabs.create({
                    url:
                      process.env.PLASMO_TARGET === "firefox-mv2"
                        ? "https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox"
                        : "chrome://extensions/shortcuts",
                  });

                  // TODO: Move isSidePanel and isFloatingPopup to jotai and use it here.
                  if (!window.location.search.includes("ref=")) {
                    window.close();
                  }
                }}
              >
                {chrome.i18n.getMessage("settingsShortcutConfigure")}
              </Button>
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsBlankItemsTitle")}</Title>
                <Text fz="xs">{chrome.i18n.getMessage("settingsBlankItemsDesc")}</Text>
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
                <Title order={6}>{chrome.i18n.getMessage("settingsSortByTitle")}</Title>
                <Text fz="xs">{chrome.i18n.getMessage("settingsSortByDesc")}</Text>
              </Stack>
              <Select
                value={settings.sortItemsBy}
                onChange={(newValue) =>
                  newValue &&
                  setSettings({
                    ...settings,
                    sortItemsBy: ItemSortOption.parse(newValue),
                  })
                }
                data={[
                  { value: ItemSortOption.Enum.DateCreated, label: chrome.i18n.getMessage("settingsSortByDateCreated") },
                  { value: ItemSortOption.Enum.DateLastCopied, label: chrome.i18n.getMessage("settingsSortByDateCopied") },
                ]}
                size="xs"
                withinPortal
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Group align="center" spacing="xs">
                  <Title order={6}>{chrome.i18n.getMessage("settingsStorageLocTitle")}</Title>
                  <Badge size="xs" color="cyan">
                    Pro
                  </Badge>
                </Group>
                <Text fz="xs">
                  {chrome.i18n.getMessage("settingsStorageLocDesc")}
                </Text>
              </Stack>
              <Select
                value={settings.storageLocation}
                onChange={(newStorageLocation) =>
                  newStorageLocation &&
                  setSettings({
                    ...settings,
                    storageLocation: StorageLocation.parse(newStorageLocation),
                  })
                }
                data={[
                  { value: StorageLocation.Enum.Local, label: chrome.i18n.getMessage("settingsStorageLocLocal") },
                  { value: StorageLocation.Enum.Cloud, label: chrome.i18n.getMessage("settingsStorageLocCloud") },
                ]}
                size="xs"
                withinPortal
                disabled={!auth.user}
              />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="interface">
          <Stack p="md">
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsTotalBadgeTitle")}</Title>
                <Text fz="xs">
                  {chrome.i18n.getMessage("settingsTotalBadgeDesc")}
                </Text>
              </Stack>
              <Switch
                checked={settings.totalItemsBadge}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await setSettings({ ...settings, totalItemsBadge: checked });

                  await sendToBackground<
                    UpdateTotalItemsBadgeRequestBody,
                    UpdateTotalItemsBadgeResponseBody
                  >({
                    name: "updateTotalItemsBadge",
                  });
                }}
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsContextMenuTitle")}</Title>
                <Text fz="xs">{chrome.i18n.getMessage("settingsContextMenuDesc")}</Text>
              </Stack>
              <Switch
                checked={settings.pasteFromContextMenu}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await setSettings({ ...settings, pasteFromContextMenu: checked });

                  await sendToBackground<
                    UpdateContextMenusRequestBody,
                    UpdateContextMenusResponseBody
                  >({
                    name: "updateContextMenus",
                  });
                }}
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsChangelogIndTitle")}</Title>
                <Text fz="xs">
                  {chrome.i18n.getMessage("settingsChangelogIndDesc")}
                </Text>
              </Stack>
              <Switch
                checked={settings.changelogIndicator}
                onChange={async (e) => {
                  const checked = e.target.checked;

                  await setSettings({ ...settings, changelogIndicator: checked });
                }}
              />
            </Group>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsDefaultTabTitle")}</Title>
                <Text fz="xs">{chrome.i18n.getMessage("settingsDefaultTabDesc")}</Text>
              </Stack>
              <Select
                value={settings.defaultTab}
                onChange={(newDefaultTab) =>
                  newDefaultTab &&
                  setSettings({ ...settings, defaultTab: Tab.parse(newDefaultTab) })
                }
                data={[
                  { value: Tab.Enum.All, label: chrome.i18n.getMessage("commonAll") },
                  { value: Tab.Enum.Favorites, label: chrome.i18n.getMessage("commonFavorites") },
                  { value: Tab.Enum.Cloud, label: chrome.i18n.getMessage("commonCloud") },
                ]}
                size="xs"
                withinPortal
              />
            </Group>
            {process.env.PLASMO_TARGET !== "firefox-mv2" && (
              <>
                <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
                <Group align="flex-start" spacing="md" position="apart" noWrap>
                  <Stack spacing={0}>
                    <Title order={6}>{chrome.i18n.getMessage("settingsDisplayModeTitle")}</Title>
                    <Text fz="xs">
                      {chrome.i18n.getMessage("settingsDisplayModeDesc")}
                    </Text>
                  </Stack>
                  <Select
                    value={settings.displayMode}
                    onChange={async (newDisplayMode) => {
                      if (newDisplayMode && newDisplayMode !== settings.displayMode) {
                        await setSettings({
                          ...settings,
                          displayMode: DisplayMode.parse(newDisplayMode),
                        });

                        // Notify background script to update display mode configuration
                        await sendToBackground({
                          name: "updateDisplayMode",
                        });

                        // Close the extension to apply the new display mode
                        window.close();
                      }
                    }}
                    data={[
                      { value: DisplayMode.Enum.Popup, label: chrome.i18n.getMessage("settingsDisplayModePopup") },
                      { value: DisplayMode.Enum.SidePanel, label: chrome.i18n.getMessage("settingsDisplayModeSidePanel") },
                    ]}
                    size="xs"
                    withinPortal
                  />
                </Group>
              </>
            )}
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsThemeTitle")}</Title>
                <Text fz="xs">{chrome.i18n.getMessage("settingsThemeDesc")}</Text>
              </Stack>
              <Select
                value={settings.themeV2}
                onChange={(theme) => theme && setSettings({ ...settings, themeV2: theme })}
                data={[
                  { value: "system", label: chrome.i18n.getMessage("settingsThemeSystem", [capitalize(systemColorScheme)]) },
                  { value: "light", label: chrome.i18n.getMessage("settingsThemeLight") },
                  { value: "dark", label: chrome.i18n.getMessage("settingsThemeDark") },
                ]}
                size="xs"
                withinPortal
              />
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="storage">
          <form
            onSubmit={storageForm.handleSubmit(
              async ({ localItemLimit, localItemCharacterLimit }) => {
                await setSettings({ ...settings, localItemLimit, localItemCharacterLimit });
                notifications.show({
                  color: "green",
                  title: chrome.i18n.getMessage("commonSuccess"),
                  message: chrome.i18n.getMessage("settingsSavedSuccess"),
                });
                storageForm.reset({ localItemLimit, localItemCharacterLimit });
              },
            )}
          >
            <Stack p="md">
              <Stack spacing="xs">
                <Group align="flex-start" position="apart" noWrap>
                  <Stack spacing={0}>
                    <Title order={6}>{chrome.i18n.getMessage("settingsLocalLimitTitle")}</Title>
                    <Text fz="xs">
                      {chrome.i18n.getMessage("settingsLocalLimitDesc")}
                    </Text>
                  </Stack>
                  <Switch
                    checked={storageForm.watch("localItemLimit") !== null}
                    onChange={(e) => {
                      storageForm.setValue(
                        "localItemLimit",
                        e.target.checked ? settings.localItemLimit || 150 : null,
                        {
                          shouldDirty: true,
                        },
                      );
                      storageForm.trigger();
                    }}
                  />
                </Group>
                <Controller
                  name="localItemLimit"
                  control={storageForm.control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(value) => field.onChange(value === "" ? 0 : value)}
                      error={storageForm.formState.errors.localItemLimit?.message}
                      disabled={field.value === null}
                      size="xs"
                    />
                  )}
                />
              </Stack>
              <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
              <Stack spacing="xs">
                <Group align="flex-start" position="apart" noWrap>
                  <Stack spacing={0}>
                    <Title order={6}>{chrome.i18n.getMessage("settingsLocalCharLimitTitle")}</Title>
                    <Text fz="xs">
                      {chrome.i18n.getMessage("settingsLocalCharLimitDesc")}
                    </Text>
                  </Stack>
                  <Switch
                    checked={storageForm.watch("localItemCharacterLimit") !== null}
                    onChange={(e) => {
                      storageForm.setValue(
                        "localItemCharacterLimit",
                        e.target.checked ? settings.localItemCharacterLimit || 25000 : null,
                        {
                          shouldDirty: true,
                        },
                      );
                      storageForm.trigger();
                    }}
                  />
                </Group>
                <Controller
                  name="localItemCharacterLimit"
                  control={storageForm.control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      value={field.value === null ? "" : field.value}
                      onChange={(value) => field.onChange(value === "" ? 0 : value)}
                      error={storageForm.formState.errors.localItemCharacterLimit?.message}
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
                  {storageForm.formState.isDirty && (
                    <>
                      <IconAlertTriangle size="1.125rem" />
                      <Text ml={4}>{chrome.i18n.getMessage("commonUnsavedChanges")}</Text>
                    </>
                  )}
                </Text>
                <Group align="center" spacing="xs">
                  <Button
                    size="xs"
                    variant="subtle"
                    disabled={!storageForm.formState.isDirty}
                    onClick={() => storageForm.reset()}
                  >
                    {chrome.i18n.getMessage("commonReset")}
                  </Button>
                  <Button size="xs" disabled={!storageForm.formState.isDirty} type="submit">
                    {chrome.i18n.getMessage("commonSave")}
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="import-export">
          <Stack p="md">
            <Stack spacing="xs">
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsImportTitle")}</Title>
                <Text fz="xs">
                  {chrome.i18n.getMessage("settingsImportDesc")}
                </Text>
              </Stack>
              <Group align="center" spacing="xs" noWrap>
                <FileInput
                  value={file}
                  onChange={setFile}
                  icon={<IconUpload size="0.8rem" />}
                  size="xs"
                  w="100%"
                  // https://github.com/mantinedev/mantine/issues/5401#issuecomment-1858711964
                  {...{ placeholder: chrome.i18n.getMessage("settingsImportPlaceholder") }}
                />
                <Button
                  leftIcon={<IconFileImport size="1rem" />}
                  size="xs"
                  disabled={file === null}
                  onClick={async () => {
                    if (file !== null) {
                      try {
                        await importFile(file);

                        notifications.show({
                          color: "green",
                          title: chrome.i18n.getMessage("commonSuccess"),
                          message: chrome.i18n.getMessage("settingsImportSuccess"),
                        });

                        setFile(null);
                      } catch (e) {
                        console.log(e);

                        notifications.show({
                          color: "red",
                          title: chrome.i18n.getMessage("commonError"),
                          message: chrome.i18n.getMessage("settingsImportError"),
                        });
                      }
                    }
                  }}
                >
                  {chrome.i18n.getMessage("settingsImportButton")}
                </Button>
              </Group>
            </Stack>
            <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
            <Group align="flex-start" spacing="md" position="apart" noWrap>
              <Stack spacing={0}>
                <Title order={6}>{chrome.i18n.getMessage("settingsExportTitle")}</Title>
                <Text fz="xs">
                  {chrome.i18n.getMessage("settingsExportDesc")}
                </Text>
              </Stack>
              <Button
                leftIcon={<IconFileExport size="1rem" />}
                size="xs"
                onClick={async () => {
                  const a = document.createElement("a");
                  a.href = window.URL.createObjectURL(
                    new Blob([JSON.stringify(await getClipboardHistoryIOExport())], {
                      type: "text/plain",
                    }),
                  );
                  a.download = `clipboard-history-io-export-${new Date().toISOString()}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                {chrome.i18n.getMessage("settingsExportButton")}
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="cloud">
          {auth.user && connectionStatus === "closed" ? (
            <Stack align="center" spacing="xs" p="xl">
              <IconWifiOff size="1.125rem" />
              <Title order={4}>{chrome.i18n.getMessage("commonOffline")}</Title>
              <Text size="sm" align="center">
                {chrome.i18n.getMessage("settingsCloudOfflineDesc")}
              </Text>
            </Stack>
          ) : !subscriptionsQuery.data?.subscriptions.length ? (
            <Stack align="center" spacing="xs" p="xl">
              <IconCloud size="1.125rem" />
              <Title order={4}>{chrome.i18n.getMessage("settingsCloudGetStartedTitle")}</Title>
              <Text size="sm" align="center">
                {chrome.i18n.getMessage("settingsCloudGetStartedDesc")}
              </Text>
              <Button
                size="xs"
                component="a"
                href={chrome.runtime.getURL("/tabs/sign-in.html")}
                target="_blank"
              >
                {chrome.i18n.getMessage("cloudPromoGetStarted")}
              </Button>
            </Stack>
          ) : (
            <form
              onSubmit={cloudForm.handleSubmit(async ({ cloudItemLimit }) => {
                await db.transact(
                  db.tx.settings[cloudSettings?.id || id()]!.update({
                    cloudItemLimit,
                  }).link({ $user: auth.user?.id }),
                );
                notifications.show({
                  color: "green",
                  title: chrome.i18n.getMessage("commonSuccess"),
                  message: chrome.i18n.getMessage("settingsSavedSuccess"),
                });
                cloudForm.reset({ cloudItemLimit });
              })}
            >
              <Stack p="md">
                <Stack spacing="xs">
                  <Group align="flex-start" position="apart" noWrap>
                    <Stack spacing={0}>
                      <Title order={6}>{chrome.i18n.getMessage("settingsCloudLimitTitle")}</Title>
                      <Text fz="xs">
                        {chrome.i18n.getMessage("settingsCloudLimitDesc")}
                      </Text>
                    </Stack>
                    <Switch
                      checked={cloudForm.watch("cloudItemLimit") !== null}
                      onChange={(e) => {
                        cloudForm.setValue(
                          "cloudItemLimit",
                          e.target.checked ? cloudSettings?.cloudItemLimit || 1000 : null,
                          {
                            shouldDirty: true,
                          },
                        );
                        cloudForm.trigger();
                      }}
                    />
                  </Group>
                  <Controller
                    name="cloudItemLimit"
                    control={cloudForm.control}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(value) => field.onChange(value === "" ? 0 : value)}
                        error={cloudForm.formState.errors.cloudItemLimit?.message}
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
                    {cloudForm.formState.isDirty && (
                      <>
                        <IconAlertTriangle size="1.125rem" />
                        <Text ml={4}>{chrome.i18n.getMessage("commonUnsavedChanges")}</Text>
                      </>
                    )}
                  </Text>
                  <Group align="center" spacing="xs">
                    <Button
                      size="xs"
                      variant="subtle"
                      disabled={!cloudForm.formState.isDirty}
                      onClick={() => cloudForm.reset()}
                    >
                      {chrome.i18n.getMessage("commonReset")}
                    </Button>
                    <Button size="xs" disabled={!cloudForm.formState.isDirty} type="submit">
                      {chrome.i18n.getMessage("commonSave")}
                    </Button>
                  </Group>
                </Group>
              </Stack>
            </form>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};
