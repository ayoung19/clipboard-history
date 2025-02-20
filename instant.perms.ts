import type { InstantRules } from "@instantdb/core";

const rules = {
  // https://www.instantdb.com/docs/permissions
  attrs: { allow: { create: "false" } },
  subscriptions: {
    allow: {
      view: "auth.email == data.email",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
