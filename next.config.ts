import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./app/i18n.ts');

const nextConfig: NextConfig = {
  // Other config options
};

export default withNextIntl(nextConfig);
