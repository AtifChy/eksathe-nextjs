import { bn } from "./bn";
import { en } from "./en";
import type { Dictionary } from "./types";
export * from "./types";

export const dictionaries: Record<import("./types").Locale, Dictionary> = { en, bn };

export function getDictionary(locale: import("./types").Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
