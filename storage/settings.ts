import { z } from "zod";

import { Storage } from "@plasmohq/storage";

import { Settings } from "~types/settings";

const storage = new Storage({
  area: "local",
});

export const watchSettings = (cb: (settings: Settings) => void) => {
  return storage.watch({
    settings: (c) => {
      cb(Settings.parse(c.newValue));
    },
  });
};

export const getSettings = async () => Settings.parse(await storage.get("settings"));

export const setSettings = async (settings: Settings) => {
  await storage.set("settings", settings);
};
