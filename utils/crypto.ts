import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

import type { Entry } from "~types/entry";

export const passwordToKey = (password: string) =>
  createHash("sha256").update(password).digest("base64");

export const encryptEntry = (key: string, entry: Entry) => {
  if (entry.cryptoInfo) {
    return entry;
  }

  const iv = randomBytes(12).toString("base64");
  const cipher = createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64"),
  );
  let ciphertext = cipher.update(entry.content, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");

  return { ...entry, content: ciphertext, cryptoInfo: { iv, tag } };
};

export const decryptEntry = (key: string, entry: Entry) => {
  if (!entry.cryptoInfo) {
    return entry;
  }

  const { cryptoInfo, content, ...rest } = entry;

  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(entry.cryptoInfo.iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(entry.cryptoInfo.tag, "base64"));

  let plaintext = decipher.update(entry.content, "base64", "utf8");
  plaintext += decipher.final("utf8");

  return { ...rest, content: plaintext };
};
