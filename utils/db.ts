import { init } from "@instantdb/react";

import schema from "~instant.schema";

const APP_ID = "2f06026c-6dc9-4190-90ce-0628007dfb22";

const db = init({ appId: APP_ID, schema });

export default db;
