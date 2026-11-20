import type { Metadata } from "next";
import { Geist_Mono, Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { profile } from "@/content/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.tagline,
  authors: [{ name: profile.name }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${jetbrains.variable}`}
    >
      <body className="overflow-x-hidden bg-bg text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
