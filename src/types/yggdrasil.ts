/** Which layer of the tree a part of the system belongs to. */
export type YggLayer = "roots" | "trunk" | "branches";

/** One service or layer of the Yggdrasil home server. */
export interface YggRealm {
  id: string;
  /** Elder Futhark rune used as the realm's mark. */
  rune: string;
  name: string;
  layer: YggLayer;
  /** The figure from Norse myth the service is named after. */
  myth: string;
  /** What the service actually is, in one line. */
  role: string;
  /** What it does in a day, in plain words. */
  detail: string;
}

/** A rule every part of the system has to follow. */
export interface YggLaw {
  title: string;
  body: string;
}

/** A moment in the system's daily rhythm. */
export interface YggMoment {
  time: string;
  title: string;
  body: string;
}

/** A theme or config published from the setup. */
export interface YggForgeItem {
  id: string;
  name: string;
  target: string;
  body: string;
  status: "ready" | "forging";
  downloads: { label: string; href: string }[];
}
