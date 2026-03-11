import MainLayout from "@/components/layout";
import CustomCursor from "@/components/ui/CustomCursor";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Josefin_Sans } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "iDF 2.0",
  description: "Portfolio Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.variable}`}
      >
        <ThemeProvider>
          {/* Custom Cursor (visible on desktop only) */}
          <CustomCursor />
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
