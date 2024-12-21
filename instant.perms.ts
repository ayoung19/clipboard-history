import type { InstantRules } from "@instantdb/react";

const rules = {
  emails: {
    allow: {
      view: "false",
      create: "true",
      update: "false",
      delete: "false",
    },
  },
  attrs: { allow: { create: "false" } },
} satisfies InstantRules;

export default rules;
