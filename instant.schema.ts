import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    subscriptions: i.entity({
      email: i.string().unique().indexed(),
    }),
    entries: i.entity({
      emailContent: i.string().unique().indexed(),
      createdAt: i.number().indexed(),
      content: i.string(),
      isFavorited: i.boolean(),
    }),
  },
  links: {
    subscriptionUser: {
      forward: { on: "subscriptions", has: "one", label: "$user" },
      reverse: { on: "$users", has: "one", label: "subscription" },
    },
    todosUser: {
      forward: { on: "entries", has: "one", label: "$user" },
      reverse: { on: "$users", has: "many", label: "entries" },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
