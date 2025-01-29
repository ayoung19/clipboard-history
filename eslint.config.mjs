// @ts-check

import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Supports Chrome 109.
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='toReversed']",
          message:
            "`Array.prototype.toReversed()` is not allowed. Use `Array.prototype.slice().reverse()` instead.",
        },
        {
          selector: "CallExpression[callee.property.name='toSorted']",
          message:
            "`Array.prototype.toSorted()` is not allowed. Use `Array.prototype.slice().sort()` instead.",
        },
      ],
    },
  },
);
