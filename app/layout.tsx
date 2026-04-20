import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Papago Next",
  description: "Minimal Next.js 14 App Router starter with Tailwind CSS.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
