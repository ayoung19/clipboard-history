import { Button, CloseButton, Code, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBug } from "@tabler/icons-react";

interface Props {
  err: unknown;
}

const serializeError = (err: unknown) => {
  if (err instanceof Error) {
    return JSON.stringify(
      {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      null,
      2,
    );
  }

  try {
    return JSON.stringify(err, null, 2);
  } catch {
    return String(err);
  }
};

export const ErrorModalContent = ({ err }: Props) => {
  return (
    <Paper p="md">
      <Group align="center" position="apart" mb="xs">
        <Title order={5}>{chrome.i18n.getMessage("commonError")}</Title>
        <CloseButton onClick={() => modals.closeAll()} />
      </Group>
      <Text fz="xs" mb="xs">
        {chrome.i18n.getMessage("errorModalMessage")}
      </Text>
      <Stack spacing="xs">
        {err instanceof AggregateError ? (
          err.errors.map((e, i) => (
            <Code key={i} block>
              {serializeError(e)}
            </Code>
          ))
        ) : (
          <Code block>{serializeError(err)}</Code>
        )}
        <Group align="center" position="right">
          <Button
            size="xs"
            leftIcon={<IconBug size="1rem" />}
            component="a"
            href={`https://form.finalform.so/forms/hvtSZgF6?${new URLSearchParams({
              error:
                err instanceof AggregateError
                  ? err.errors.map((e) => serializeError(e)).toString()
                  : serializeError(err),
            }).toString()}`}
            target="_blank"
          >
            {chrome.i18n.getMessage("errorModalSubmitBug")}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};
