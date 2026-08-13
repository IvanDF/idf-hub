import type { CommandOutput } from "@/types/terminal";

/**
 * "Cheers around the world" — a living travel journal of how you say
 * *skål / cin cin* in every language iDF has toasted in on the road.
 *
 * TO ADD A NEW TOAST: just append one entry to the `CHEERS` array below.
 * No other file needs to change — the terminal `cheers` command renders
 * whatever is here. Keep `flags` as the emoji flag(s) of the place(s), and
 * put every spoken variant in `phrase` separated by " · ".
 */
export type CheersEntry = {
  /** Flag emoji of the country/countries — space-separated if more than one. */
  flags: string;
  /** Language or people the toast belongs to. */
  language: string;
  /** The toast itself; multiple spellings/variants joined with " · ". */
  phrase: string;
};

export const CHEERS: CheersEntry[] = [
  { flags: "🇬🇷", language: "Greek", phrase: "Yamas" },
  { flags: "🇩🇪 🇦🇹", language: "German / Austrian", phrase: "Prost · Prosit · Pröst" },
  { flags: "🇬🇧", language: "English", phrase: "Cheers" },
  { flags: "🇮🇪", language: "Irish (Gaelic)", phrase: "Sláinte" },
  { flags: "🇸🇪 🇳🇴 🇩🇰 🇮🇸", language: "Scandinavian / Norse", phrase: "Skål" },
  { flags: "🇭🇷", language: "Croatian", phrase: "Živjeli" },
  { flags: "🇸🇰", language: "Slovak", phrase: "Na zdravie" },
  { flags: "🇪🇸", language: "Spanish", phrase: "Salud" },
  { flags: "🇫🇷", language: "French", phrase: "Santé · Tchin-tchin" },
  { flags: "🇲🇹", language: "Maltese", phrase: "Saħħa" },
  { flags: "🇪🇸", language: "Basque", phrase: "Topa" },
];

/**
 * Builds the terminal output for the `cheers` easter egg: a title, one line
 * per toast, and a running count that grows as the journal does.
 */
export function buildCheersOutput(): CommandOutput[] {
  return [
    { type: "success", content: "🍻 SKÅL! — Cheers around the world" },
    { type: "system", content: "Collected on the road · updated every trip" },
    ...CHEERS.map(
      (c): CommandOutput => ({
        type: "text",
        content: `${c.flags}  ${c.phrase} — ${c.language}`,
      }),
    ),
    {
      type: "system",
      content: `${CHEERS.length} languages and counting…`,
    },
  ];
}
