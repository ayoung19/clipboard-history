import { Storage } from "@plasmohq/storage";

const storage = new Storage({
  area: "local",
});

export const watchClipboardContent = (cb: (clipboardContent?: string) => void) => {
  return storage.watch({
    clipboardContent: (c) => cb(typeof c.newValue === "string" ? c.newValue : undefined),
  });
};

export const getClipboardContent = async () => storage.get("clipboardContent");

export const setClipboardContent = async (clipboardContent: string) =>
  storage.set("clipboardContent", clipboardContent);
