import { Badge, Box, rem } from "@mantine/core";
import { generateColor } from "@marko19907/string-to-color";

interface Props {
  tag: string;
  fullTag?: string;
}

export const TagBadge = ({ tag, fullTag }: Props) => {
  return (
    <Badge
      title={fullTag}
      variant="dot"
      size="xs"
      sx={{
        userSelect: "none",
        "::before": { content: "none" },
        maxWidth: "none",
        whiteSpace: "nowrap",
        overflow: "visible",
        flexShrink: 0,
      }}
      leftSection={
        <Box
          sx={{
            width: rem(4),
            height: rem(4),
            borderRadius: rem(4),
            backgroundColor: generateColor(tag),
          }}
        />
      }
    >
      {tag}
    </Badge>
  );
};
