import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voting App",
  description: "A voting application built with Next.js",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>; // ✅ Define params as a promise
}) {
  // Resolve params properly
  const resolvedParams = params ? await params : { locale: 'en' }; // ✅ Handle cases where params is undefined
  const lang = resolvedParams.locale || 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}