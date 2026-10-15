import type { Metadata } from "next";

const description =
  "A home server designed around one person's day: the house, the notes, the training plan and the backups, on hardware I own.";

// The companion scene, rendered once from the real source on the server
// itself (assets/companion/, Python + Pillow) rather than redrawn for the
// web. Used as the share-link preview, the one place this page gets a
// cover image at all.
const cover = {
  url: "/projects/yggdrasil/cover.png",
  width: 600,
  height: 344,
  alt: "The home server drawn as the world tree: Ratatoskr the squirrel at its roots, the nine realms as landmarks around it.",
};

export const metadata: Metadata = {
  title: "Yggdrasil",
  description,
  alternates: { canonical: "/yggdrasil" },
  openGraph: { title: "Yggdrasil", description, url: "/yggdrasil", type: "article", images: [cover] },
  twitter: { card: "summary_large_image", title: "Yggdrasil", description, images: [cover.url] },
};

export default function YggdrasilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
