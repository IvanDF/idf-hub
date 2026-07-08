import MainLayout, { SiteChrome } from "@/components/templates/Layout";
import MotionProvider from "@/components/atoms/motion-provider";
import FusRoDahWrapper from "@/components/organisms/fus-ro-dah";
import { socials } from "@/data/nav";
import InkFilters from "@/components/atoms/ink-filters/InkFilters";
import RouteTracker from "@/components/atoms/route-tracker/RouteTracker";
import { AudioProvider } from "@/context/AudioContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { VoiceShoutProvider } from "@/context/VoiceShoutContext";
import { DESIGN_SYSTEM } from "@/styles/design-system";
import "@/styles/globals.scss";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Josefin_Sans, Josefin_Slab } from "next/font/google";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const josefinSlab = Josefin_Slab({
  variable: "--font-josefin-slab",
  subsets: ["latin"],
  weight: ["700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://idf-hub.vercel.app";
const siteName = "iDF";
const siteDescription =
  "Portfolio hub with interactive experiments, polished micro-effects, and playful digital craftsmanship.";
const socialImagePath = "/opengraph-image";
const brandColor = DESIGN_SYSTEM.color.brandDark;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: DESIGN_SYSTEM.color.manifestLight },
    { media: "(prefers-color-scheme: dark)", color: DESIGN_SYSTEM.color.brandDark },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  keywords: [
    "portfolio",
    "interactive",
    "experiments",
    "creative coding",
    "frontend",
    "motion design",
  ],
  authors: [{ name: "Ivan D'F" }],
  creator: "Ivan D'F",
  publisher: "Ivan D'F",
  category: "portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: socialImagePath,
        width: 1200,
        height: 630,
        alt: `${siteName} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [socialImagePath],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: brandColor,
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": brandColor,
  },
};

// Structured data: lets search engines connect the site, the person and the
// social profiles (single source: the same socials array the chrome renders).
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ivan Del Fatti",
  alternateName: "iDF",
  url: siteUrl,
  jobTitle: "Full-Stack Developer & UI/UX Designer",
  description: "Driven by curiosity, refined through design.",
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${josefinSans.variable} ${josefinSlab.variable} ${geistMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>
          <ThemeProvider>
            <AudioProvider>
              <VoiceShoutProvider>
                <InkFilters />
                <RouteTracker />
                <SiteChrome />
                <MainLayout>{children}</MainLayout>
                <FusRoDahWrapper />
              </VoiceShoutProvider>
            </AudioProvider>
          </ThemeProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
