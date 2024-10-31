import { renameSync } from "fs";

// mv .package.json package.json
renameSync(".package.json", "package.json");
