import { init } from "@instantdb/core";

import schema from "~instant.schema";
import env from "~utils/env";

const db = init({ appId: env.INSTANT_APP_ID, schema: schema });

export default db;
