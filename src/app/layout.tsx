import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Poiret_One,
  Playfair_Display_SC,
  Nunito,
} from "next/font/google";
import { DesktopWarning } from "@/components/DesktopWarning";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-great-vibes-google",
});

const poiretOne = Poiret_One({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-poiret-one",
});

const playfairSC = Playfair_Display_SC({
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
  variable: "--font-playfair-sc",
});

const nunito = Nunito({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-nunito",
});

export const viewport: Viewport = {
  themeColor: "#FFF8F0",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Свадебное приглашение",
  description: "Мы приглашаем вас разделить наш особенный день",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${greatVibes.variable} ${poiretOne.variable} ${playfairSC.variable} ${nunito.variable}`}
    >
      <body className="antialiased">
        <DesktopWarning />
        {children}
      </body>
    </html>
  );
}
