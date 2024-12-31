import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { Translator, type TargetLanguageCode } from "deepl-node";

import enMessagesJson from "../locales/en/messages.json";

const ALL_CHROME_I18N_LANGUAGE_CODES = [
  "ar",
  "am",
  "bg",
  "bn",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "en_AU",
  "en_GB",
  "en_US",
  "es",
  "es_419",
  "et",
  "fa",
  "fi",
  "fil",
  "fr",
  "gu",
  "he",
  "hi",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "kn",
  "ko",
  "lt",
  "lv",
  "ml",
  "mr",
  "ms",
  "nl",
  "no",
  "pl",
  "pt_BR",
  "pt_PT",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "sv",
  "sw",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "vi",
  "zh_CN",
  "zh_TW",
] as const;

type ChromeI18nLanguageCode = (typeof ALL_CHROME_I18N_LANGUAGE_CODES)[number];

const languageCodeChromeToDeepL = (
  langChrome: ChromeI18nLanguageCode,
): TargetLanguageCode | null => {
  switch (langChrome) {
    case "am":
    case "bn":
    case "ca":
    case "fa":
    case "fil":
    case "gu":
    case "he":
    case "hi":
    case "hr":
    case "kn":
    case "ml":
    case "mr":
    case "ms":
    case "no":
    case "sr":
    case "sw":
    case "ta":
    case "te":
    case "th":
    case "vi":
      return null;

    case "en":
    case "en_US":
      return "en-US";

    case "en_AU":
    case "en_GB":
      return "en-GB";

    case "es_419":
      return "es";

    case "pt_BR":
      return "pt-BR";

    case "pt_PT":
      return "pt-PT";

    case "zh_CN":
    case "zh_TW":
      return "zh";
  }

  return langChrome;
};

const writeMessagesJson = (lang: ChromeI18nLanguageCode, data: string) => {
  mkdirSync(path.join("locales", lang));
  writeFileSync(path.join("locales", lang, "messages.json"), data);
};

const translator = new Translator("b2c0e6a4-a0b7-46f8-82f1-2473d1e21355:fx");

const languageCodeDeepLToMessagesJson: Record<string, Record<string, { message: string }>> = {};

const wtf = async () => {
  const lmao = await Promise.all(
    ALL_CHROME_I18N_LANGUAGE_CODES.filter((lang) => lang === "de").flatMap((lang) => {
      const l = languageCodeChromeToDeepL(lang);
      if (l === null) {
        return [];
      } else {
        return Object.entries(enMessagesJson).map(([key, { message, description }]) =>
          (async () => {
            const translation = await translator.translateText(message, "en", l, {
              context: description,
            });

            return [l, { [key]: { message: translation.text } }] as const;
          })(),
        );
      }
    }),
  );

  lmao.forEach(([key, val]) => {
    languageCodeDeepLToMessagesJson[key] = { ...languageCodeDeepLToMessagesJson[key], ...val };
  });

  ALL_CHROME_I18N_LANGUAGE_CODES.filter((lang) => lang === "de").forEach((lang) => {
    const l = languageCodeChromeToDeepL(lang);

    if (l !== null && languageCodeDeepLToMessagesJson[l]) {
      writeMessagesJson(lang, JSON.stringify(languageCodeDeepLToMessagesJson[l]));
    }
  });
};

wtf();
