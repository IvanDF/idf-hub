import GlobalBackground from "@/components/background/GlobalBackground";
import MainLayout from "@/components/layout";
import SecretGateway from "@/components/layout/SecretGateway";
import CustomCursor from "@/components/ui/CustomCursor";
import AudioPrompt from "@/components/ui/AudioPrompt";
import { ThemeProvider } from "@/context/ThemeContext";
import { AudioProvider } from "@/context/AudioContext";
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
          <AudioProvider>
            <CustomCursor />
            <SecretGateway />
            <AudioPrompt />

            <MainLayout>{children}</MainLayout>
            <GlobalBackground />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
