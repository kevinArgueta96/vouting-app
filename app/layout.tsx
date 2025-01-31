import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vouting App",
  description: "A voting application built with Next.js",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params?: { locale?: string }
}) {
  // Await params and default to 'en' if no locale is provided
  const lang = (await params)?.locale || 'en';
  
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
