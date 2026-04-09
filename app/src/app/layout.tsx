import type { Metadata } from "next";
import { Newsreader, Lexend, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Enterprise Guide to AI Adoption",
  description:
    "A comprehensive, actionable guide to building, governing, and scaling AI across your organization. Opinionated. Practical. Honest.",
  openGraph: {
    title: "The Enterprise Guide to AI Adoption",
    description:
      "Cut through the noise. A comprehensive guide for the messy middle of enterprise AI adoption.",
    type: "article",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${lexend.variable} ${jakarta.variable} h-full`}
    >
      <body className="min-h-full bg-surface antialiased">{children}</body>
    </html>
  );
}
