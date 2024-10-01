import { Badge } from "@mantine/core";
import { generateColor } from "@marko19907/string-to-color";

interface Props {
  tag: string;
}

export const TagBadge = ({ tag }: Props) => {
  return (
    <Badge variant="dot" size="xs" sx={{ "::before": { backgroundColor: generateColor(tag) } }}>
      {tag}
    </Badge>
  );
};
