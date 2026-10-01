import type { CommandOutput } from "@/types/terminal";
import styles from "@/components/organisms/Terminal/Terminal.module.scss";

/**
 * "Cheers around the world" — a living travel journal of how you say
 * *skål / cin cin* in every language iDF has toasted in on the road.
 *
 * TO ADD A NEW TOAST: append one entry to the `CHEERS` array below. No other
 * file needs to change — the terminal `cheers` command renders whatever is here.
 *
 * TO LINK ONE TO ITS TRIP: put the FindPenguins slug on the *place*, not the
 * toast — `the-fjord-gates`, not the whole URL. The flag becomes the link, so
 * a toast shared by several countries keeps one line and still sends each flag
 * to the journey it belongs to. A place with no trip is plain text, so gaps
 * cost nothing.
 */
export type CheersPlace = {
  /** Flag emoji of the country. */
  flag: string;
  /** FindPenguins trip slug where this toast was collected here. */
  trip?: string;
};

export type CheersEntry = {
  /** One or more countries the toast belongs to. */
  places: CheersPlace[];
  /** Language or people the toast belongs to. */
  language: string;
  /** The toast itself; multiple spellings/variants joined with " · ". */
  phrase: string;
};

const FINDPENGUINS = "https://findpenguins.com/idf.travel/trip";

/** New Year in Vienna — where several of these were collected in one night. */
const VIENNA = "the-midwinter-run";

/** The Baltic crossing: Estonia and Finland on the same journey. */
const BALTIC = "the-baltic-crossing";

export const CHEERS: CheersEntry[] = [
  { places: [{ flag: "🇬🇷", trip: "gates-of-athens" }], language: "Greek", phrase: "Yamas" },
  {
    places: [
      { flag: "🇩🇪", trip: "the-bavarian-feast" },
      { flag: "🇦🇹", trip: VIENNA },
    ],
    language: "German / Austrian",
    phrase: "Prost · Prosit · Pröst",
  },
  // No UK trip in the journal — stays unlinked rather than pointing somewhere
  // it was not said.
  { places: [{ flag: "🇬🇧" }], language: "English", phrase: "Cheers" },
  {
    places: [{ flag: "🇮🇪", trip: "the-emerald-run" }],
    language: "Irish (Gaelic)",
    phrase: "Sláinte",
  },
  // One line, three destinations. The same toast was collected on three
  // different journeys, and the flag is what carries you to the right one.
  // Iceland is not here: never been, so there is nothing to link to.
  {
    places: [
      { flag: "🇸🇪", trip: "northward-to-stockholm" },
      { flag: "🇳🇴", trip: "the-fjord-gates" },
      { flag: "🇩🇰", trip: "the-danish-passage" },
    ],
    language: "Scandinavian / Norse",
    phrase: "Skål",
  },
  { places: [{ flag: "🇭🇷", trip: VIENNA }], language: "Croatian", phrase: "Živjeli" },
  { places: [{ flag: "🇸🇰", trip: VIENNA }], language: "Slovak", phrase: "Na zdravie" },
  { places: [{ flag: "🇪🇸", trip: VIENNA }], language: "Spanish", phrase: "Salud" },
  {
    places: [{ flag: "🇫🇷", trip: "valfrejus-heights" }],
    language: "French",
    phrase: "Santé · Tchin-tchin",
  },
  { places: [{ flag: "🇲🇹", trip: VIENNA }], language: "Maltese", phrase: "Saħħa" },
  {
    places: [{ flag: "🇪🇸", trip: "the-basque-feast" }],
    language: "Basque",
    phrase: "Topa",
  },
  { places: [{ flag: "🇪🇪", trip: BALTIC }], language: "Estonian", phrase: "Terviseks" },
  { places: [{ flag: "🇫🇮", trip: BALTIC }], language: "Finnish", phrase: "Kippis" },
];

/**
 * Builds the terminal output: a title, one line per toast, and a running count
 * that grows as the journal does.
 *
 * The flags are the links. They are given real padding rather than left as bare
 * emoji — an emoji glyph is about 18px, and a tap target that small fails on a
 * phone, which is where a travel journal is most likely to be read.
 */
export function buildCheersOutput(): CommandOutput[] {
  const linked = CHEERS.flatMap((c) => c.places).filter((p) => p.trip).length;

  return [
    { type: "success", content: "🍻 SKÅL! — Cheers around the world" },
    { type: "system", content: "Collected on the road · the flag opens the trip" },
    ...CHEERS.map(
      (c, i): CommandOutput => ({
        type: "text",
        content: (
          <span key={i}>
            {c.places.map((p) =>
              p.trip ? (
                <a
                  key={p.flag}
                  className={styles.flagLink}
                  href={`${FINDPENGUINS}/${p.trip}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${c.language} — open the trip it was collected on`}
                >
                  {p.flag}
                </a>
              ) : (
                <span key={p.flag} className={styles.flagPlain}>
                  {p.flag}
                </span>
              ),
            )}
            {` ${c.phrase} — ${c.language}`}
          </span>
        ),
      }),
    ),
    {
      type: "system",
      content: `${CHEERS.length} languages and counting · ${linked} flags open their trip`,
    },
  ];
}
