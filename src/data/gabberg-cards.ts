/**
 * The printed GabberG cards, one entry per QR code that exists on paper.
 *
 * Each card is the same deployed page with a different `?card_type=`, which is
 * the whole idea of the project: one build, one deploy, and a new persona is a
 * new printed code rather than a new release.
 *
 * TO ADD A CARD: append an entry and run `npm run qr`. The generator writes an
 * SVG per card into public/projects/gabberg-icard/qr/ and the detail page picks
 * it up. Nothing is encoded at runtime.
 *
 * ⚠️ Only one variant is recorded so far, the one the project's `links.live`
 * points at. The rest of the printed codes are Ivan's to supply.
 */
export interface GabbergCard {
  /** The `card_type` value printed on that code. */
  type: string;
  /** Who the card introduces, as shown under the code. */
  label: string;
  /** Where it was handed out, when that is the point of the variant. */
  context?: string;
}

export const GABBERG_BASE = "https://gabberg.netlify.app/";

export const GABBERG_CARDS: GabbergCard[] = [
  {
    type: "dp-ygh-001-01",
    label: "GabberG",
    context: "The cosplay persona, the card the project ships with",
  },
];

/** The address a given card's code resolves to. */
export function cardUrl(card: GabbergCard): string {
  return `${GABBERG_BASE}?card_type=${card.type}`;
}

/** Where the generator writes that card's code. */
export function cardQrPath(card: GabbergCard): string {
  return `/projects/gabberg-icard/qr/${card.type}.svg`;
}
