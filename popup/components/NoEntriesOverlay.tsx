import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export const NoEntriesOverlay = ({ title, subtitle, description }: Props) => {
  return (
    <Stack align="center" spacing={0} p="xl">
      <Text size="md">{title}</Text>
      {subtitle && (
        <Text size="sm" color="dimmed">
          {subtitle}
        </Text>
      )}
      {description && (
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      )}
    </Stack>
  );
};
