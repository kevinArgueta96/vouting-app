import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from 'next-intl'
import { locales, type Locale } from "../i18n"
import Header from "../components/header"

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
  // Await and destructure the locale param
  const { locale } = await params;
  // Cast and validate the locale param
  const validLocale = locale as Locale;
  if (!locales.includes(validLocale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default;
  } catch (error) {
    notFound();
  }

  // Use the validated locale
  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Header />
      <main>
        {children}
      </main>
    </NextIntlClientProvider>
  )
}
