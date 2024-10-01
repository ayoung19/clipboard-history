import { ActionIcon, Divider, Popover, rem, Stack, Text, TextInput } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { IconFolderPlus } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";

import { allTagsAtom } from "~popup/states/atoms";
import { commonActionIconSx, defaultBorderColor } from "~utils/sx";

import { TagOption } from "./TagOption";

interface Props {
  entryId: string;
}

export const TagSelect = ({ entryId }: Props) => {
  const allTags = useAtomValue(allTagsAtom);
  const [opened, handlers] = useDisclosure(false);
  const [tagSearch, setTagSearch] = useState("");
  const tagSearchLowercase = useMemo(() => tagSearch.toLowerCase(), [tagSearch]);
  const matchedTags = allTags.toSorted().filter((tag) => tag.includes(tagSearchLowercase));

  const [focusedTagIndex, setFocusedTagIndex] = useState(0);

  useEffect(() => {
    if (opened) {
      setTagSearch("");
      setFocusedTagIndex(0);
    }
  }, [opened]);

  useEffect(() => {
    setFocusedTagIndex(0);
  }, [tagSearch]);

  useHotkeys(
    [
      [
        "ArrowUp",
        () =>
          setFocusedTagIndex(
            (prevState) => Math.abs(matchedTags.length + prevState - 1) % matchedTags.length,
          ),
      ],
      [
        "ArrowDown",
        () =>
          setFocusedTagIndex(
            (prevState) => Math.abs(matchedTags.length + prevState + 1) % matchedTags.length,
          ),
      ],
    ],
    [],
  );

  return (
    <Popover
      opened={opened}
      onChange={(opened) => (opened ? handlers.open() : handlers.close())}
      width={200}
      position="bottom-end"
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon
          sx={(theme) => commonActionIconSx({ theme })}
          onClick={(e) => {
            e.stopPropagation();

            handlers.toggle();
          }}
        >
          <IconFolderPlus size="1rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={0} onClick={(e) => e.stopPropagation()} sx={{ cursor: "default" }}>
        <TextInput
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          size="xs"
          variant="unstyled"
          placeholder="Modify tags..."
          autoFocus
          px="xs"
        />
        <Divider sx={(theme) => ({ borderColor: defaultBorderColor(theme) })} />
        <Stack spacing={0} p={rem(4)}>
          {matchedTags.length === 0 ? (
            <>
              <Text fz="xs" color="dimmed">
                Create new tag:
              </Text>
              <TagOption
                entryId={entryId}
                tag={tagSearchLowercase}
                focused={true}
                onHover={() => setFocusedTagIndex(0)}
                onClose={() => handlers.close()}
              />
            </>
          ) : (
            matchedTags.map((tag, i) => (
              <TagOption
                key={tag}
                entryId={entryId}
                tag={tag}
                focused={focusedTagIndex === i}
                onHover={() => setFocusedTagIndex(i)}
                onClose={() => handlers.close()}
              />
            ))
          )}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
