import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Свадебное приглашение",
  description: "Мы приглашаем вас разделить наш особенный день",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dynalight&family=Great+Vibes:wght@400&family=Nunito:wght@300;400;500;600&display=swap&subset=cyrillic,latin"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

