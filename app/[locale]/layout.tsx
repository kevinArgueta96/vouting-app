import type { Metadata } from "next";
import "../globals.css";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { locales, type Locale } from "../i18n";
import Header from "../components/header";

export const metadata: Metadata = {
  title: "Voting App",
  description: "A voting application built with Next.js",
};

// Generación de parámetros estáticos para rutas localizadas
export function generateStaticParams() {
  return locales.map((locale: string) => ({ locale }));
}

// Definir props explícitamente
interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>; // 🔥 Se define params como una promesa
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Asegurar que params sea una promesa y resolverla
  const resolvedParams = await params; // 🔥 Se usa await para resolver la promesa
  const { locale } = resolvedParams;

  const validLocale = locale as Locale;
  if (!locales.includes(validLocale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Header />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}