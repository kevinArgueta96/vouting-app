import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from 'next-intl'
import { locales } from "../i18n"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vouting App",
  description: "A voting application built with Next.js",
}

export function generateStaticParams() {
  return locales.map((locale: string) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
