import { Checkbox, Group, rem } from "@mantine/core";
import { useFocusWithin, useHotkeys, useMouse } from "@mantine/hooks";
import { useEffect } from "react";

import { useEntryIdToTags } from "~popup/contexts/EntryIdToTagsContext";
import { setEntryIdToTags } from "~storage/entryIdToTags";
import { lightOrDark } from "~utils/sx";

import { TagBadge } from "./TagBadge";

interface Props {
  entryId: string;
  tag: string;
  focused: boolean;
  onHover: () => void;
  onClose: () => void;
}

export const TagOption = ({ entryId, tag, focused, onHover, onClose }: Props) => {
  const { ref: groupRef, x, y } = useMouse({ resetOnExit: true });
  const { ref: checkboxRef, focused: checkboxFocused } = useFocusWithin<HTMLInputElement>();
  const entryIdToTags = useEntryIdToTags();
  const currentTags = entryIdToTags[entryId] || [];
  const checked = currentTags.includes(tag);

  const toggleTag = () => {
    setEntryIdToTags({
      ...entryIdToTags,
      [entryId]: checked ? currentTags.filter((x) => x !== tag) : [...currentTags, tag],
    });
  };

  useEffect(() => {
    if (x === 0 && y === 0) {
      return;
    }

    onHover();
  }, [x, y]);

  // Unfocus the checkbox whenever focused to emphasize that the group focus
  // has priority.
  useEffect(() => {
    if (checkboxFocused) {
      checkboxRef.current.blur();
    }
  }, [checkboxFocused]);

  useHotkeys(
    [
      [
        "Enter",
        () => {
          if (focused) {
            toggleTag();
            onClose();
          }
        },
      ],
    ],
    [],
  );

  return (
    <Group
      ref={groupRef}
      align="center"
      className="tag-option"
      spacing="xs"
      px={rem(4)}
      py={rem(8)}
      sx={(theme) => ({
        cursor: "pointer",
        borderRadius: theme.radius.sm,
        backgroundColor: focused
          ? lightOrDark(theme, theme.colors.gray[1], theme.colors.dark[5])
          : undefined,
      })}
      noWrap
      onClick={() => {
        toggleTag();
        onClose();
      }}
    >
      <Checkbox
        ref={checkboxRef}
        checked={checked}
        size="xs"
        onChange={() => {
          toggleTag();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        sx={(theme) => ({
          ".mantine-Checkbox-input:hover": {
            borderColor: theme.fn.primaryColor(),
          },
        })}
      />
      <TagBadge tag={tag} />
    </Group>
  );
};
