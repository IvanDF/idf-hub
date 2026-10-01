import type { CommandOutput } from "@/types/terminal";

/**
 * "Cheers around the world" — a living travel journal of how you say
 * *skål / cin cin* in every language iDF has toasted in on the road.
 *
 * TO ADD A NEW TOAST: append one entry to the `CHEERS` array below. No other
 * file needs to change — the terminal `cheers` command renders whatever is
 * here. Keep `flags` as the emoji flag(s) of the place(s), and put every spoken
 * variant in `phrase` separated by " · ".
 *
 * TO LINK A TOAST TO ITS TRIP: add `trip`, the slug from findpenguins.com —
 * `the-fjord-gates`, not the whole URL. The line becomes a link to the journal
 * entry where that toast was actually collected, which is the point of the
 * whole command. A toast with no trip renders as plain text, so an unlinked
 * entry costs nothing.
 */
export type CheersEntry = {
  /** Flag emoji of the country/countries — space-separated if more than one. */
  flags: string;
  /** Language or people the toast belongs to. */
  language: string;
  /** The toast itself; multiple spellings/variants joined with " · ". */
  phrase: string;
  /** FindPenguins trip slug where this one was collected. */
  trip?: string;
};

const FINDPENGUINS = "https://findpenguins.com/idf.travel/trip";

export const CHEERS: CheersEntry[] = [
  { flags: "🇬🇷", language: "Greek", phrase: "Yamas", trip: "gates-of-athens" },
  {
    flags: "🇩🇪 🇦🇹",
    language: "German / Austrian",
    phrase: "Prost · Prosit · Pröst",
    trip: "the-bavarian-feast",
  },
  // No UK trip in the journal yet — stays unlinked rather than pointing
  // somewhere it was not said.
  { flags: "🇬🇧", language: "English", phrase: "Cheers" },
  {
    flags: "🇮🇪",
    language: "Irish (Gaelic)",
    phrase: "Sláinte",
    trip: "the-emerald-run",
  },
  // The Scandinavian row used to be one line with four flags. Split, because
  // the same toast was collected on three different journeys and the whole
  // idea is that each one takes you to the right one.
  {
    flags: "🇸🇪",
    language: "Swedish",
    phrase: "Skål",
    trip: "northward-to-stockholm",
  },
  {
    flags: "🇳🇴",
    language: "Norwegian",
    phrase: "Skål",
    trip: "the-fjord-gates",
  },
  {
    flags: "🇩🇰",
    language: "Danish",
    phrase: "Skål",
    trip: "the-danish-passage",
  },
  { flags: "🇮🇸", language: "Icelandic", phrase: "Skál" },
  { flags: "🇭🇷", language: "Croatian", phrase: "Živjeli" },
  { flags: "🇸🇰", language: "Slovak", phrase: "Na zdravie" },
  // Four Spanish trips in the journal and no way to tell which one this was
  // said on. Ivan picks.
  { flags: "🇪🇸", language: "Spanish", phrase: "Salud" },
  {
    flags: "🇫🇷",
    language: "French",
    phrase: "Santé · Tchin-tchin",
    trip: "valfrejus-heights",
  },
  // "Isle of the Knights" reads like Malta — the Knights of St John — but that
  // is an inference, not something the journal states.
  { flags: "🇲🇹", language: "Maltese", phrase: "Saħħa" },
  {
    flags: "🇪🇸",
    language: "Basque",
    phrase: "Topa",
    trip: "the-basque-feast",
  },
  { flags: "🇪🇪", language: "Estonian", phrase: "Terviseks" },
  { flags: "🇫🇮", language: "Finnish", phrase: "Kippis" },
];

/**
 * Builds the terminal output for the `cheers` easter egg: a title, one line per
 * toast, and a running count that grows as the journal does. A toast with a
 * trip becomes a link to the journey it was collected on.
 */
export function buildCheersOutput(): CommandOutput[] {
  const linked = CHEERS.filter((c) => c.trip).length;

  return [
    { type: "success", content: "🍻 SKÅL! — Cheers around the world" },
    { type: "system", content: "Collected on the road · updated every trip" },
    ...CHEERS.map((c): CommandOutput => {
      const line = `${c.flags}  ${c.phrase} — ${c.language}`;
      return c.trip
        ? {
            type: "link",
            content: `${line}  ↗`,
            href: `${FINDPENGUINS}/${c.trip}`,
          }
        : { type: "text", content: line };
    }),
    {
      type: "system",
      content: `${CHEERS.length} languages and counting · ${linked} link to the trip they were collected on`,
    },
  ];
}
