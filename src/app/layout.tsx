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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

