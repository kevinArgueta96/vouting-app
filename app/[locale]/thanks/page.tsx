"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { routes } from "@/app/config/routes";
import { useEffect, useState, useCallback } from "react";
import ClipboardAnimation from "@/app/components/ui/clipboard-animation";

function useOptimalSize() {
  const [size, setSize] = useState({ width: 320, height: 400 });
  const [isDesktop, setIsDesktop] = useState(false);

  const calculateSize = useCallback(() => {
    if (typeof window === "undefined") return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isDesktopView = viewportWidth >= 1024;
    setIsDesktop(isDesktopView);

    // Calcular espacio disponible considerando márgenes de seguridad
    const topSpace = isDesktopView ? 120 : 100;
    const bottomSpace = isDesktopView ? 200 : 150;
    const horizontalPadding = isDesktopView ? 64 : 48;

    const availableHeight = viewportHeight - (topSpace + bottomSpace);
    const availableWidth = viewportWidth - horizontalPadding;

    // Ancho mínimo para el contenido
    const minContentWidth = 320;
    const maxContentWidth = isDesktopView ? 800 : 500;

    // Calcular dimensiones base manteniendo proporción y límites
    let width = Math.min(availableWidth, maxContentWidth);
    let height = Math.min(availableHeight, isDesktopView ? 800 : 600);

    // Asegurar ancho mínimo
    width = Math.max(width, minContentWidth);

    // Mantener proporción adaptada según el dispositivo
    const aspectRatio = isDesktopView ? 1.4 : 1.2;

    // Ajustar dimensiones manteniendo el aspect ratio y asegurando espacio para contenido
    if (width * aspectRatio > height) {
      width = height / aspectRatio;
      if (width < minContentWidth) {
        width = minContentWidth;
        height = width * aspectRatio;
      }
    } else {
      height = width * aspectRatio;
    }

    // Aplicar límites finales
    width = Math.min(Math.round(width), maxContentWidth);
    height = Math.min(Math.round(height), isDesktopView ? 800 : 600);

    setSize({ width, height });
  }, []);

  useEffect(() => {
    calculateSize();
    const debouncedResize = debounce(calculateSize, 100);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [calculateSize]);

  return { ...size, isDesktop };
}

// Función de debounce para optimizar el rendimiento
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function ThanksPage() {
  const t = useTranslations("Thanks");
  const locale = useLocale();
  const { width, height, isDesktop } = useOptimalSize();

  return (
    <main className="min-h-screen bg-[#334798] relative flex flex-col">
      <ClipboardAnimation />
      {/* Main logo */}
      <div className="flex justify-center mt-2 lg:mb-12 mb-3">
        <div
          className="bg-white lg:w-[400px] w-[300px] lg:h-[160px] h-[120px] flex items-center justify-center"
          style={{ borderRadius: "100% / 100%" }}
        >
          <Image
            src={`/svg/hdf_heslins_drink_logo.svg`}
            alt="HDF Helsinki Drink Festival"
            width={100}
            height={100}
            style={{ width: "70%", height: "auto" }}
            priority
            className="lg:scale-15"
          />
        </div>
      </div>

      {/* Content section */}
      <div className="relative flex-grow">
        {/* Background SVG Container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div
            className="relative transition-all duration-300 ease-in-out transform lg:-mt-[28rem] -mt-[32rem]"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              margin: "0 auto",
              top: isDesktop ? "0" : "-15%",
            }}
          >
            <Image
              src={`/svg/thanks_background.svg`}
              alt="Background"
              fill
              priority
            />
            <Image
              src="/images/thaks_emoji.png"
              alt="Thanks emoji"
              width={6}
              height={6}
              className="absolute lg:right-[-5%] right-[0%] lg:bottom-[85%] bottom-[80%] lg:w-[100px] w-[70px]"
              priority
            />
            <Image
              src="/images/thanks_coktail.png"
              alt="Thanks cocktail"
              width={150}
              height={150}
              className="absolute lg:top-[10%] top-[10%] lg:right-[80%] z-1 lg:w-[100px] w-[70px]"
              priority
            />
            <Image
              src="/images/thanks_hand.png"
              alt="Thanks hand"
              width={150}
              height={150}
              className="absolute lg:top-[65%] top-[70%] lg:left-[65%] left-[60%] z-10 lg:w-[250px] w-[180px]"
              priority
            />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-start lg:p-22 p-20">
            {/* Thank you text */}
            <div className="lg:mb-8 mb-10">
              <div
                className="mx-auto text-white text-center uppercase mt-1 lg:mt-8 lg:h-[80px]"
                style={{
                  fontFamily: "Russo One",
                  fontSize: "clamp(2rem, 1vw, 3rem)",
                  width: "100%",
                  letterSpacing: "-0.35px",
                  lineHeight: "1.1",
                }}
              >
                <span className="lg:max-w-[90%]  block mx-auto">{t('thankYouForVoting')}</span>
              </div>
            </div>

            {/* Options Container */}
            <div className="lg:w-[320px] w-[180px] overflow-hidden mx-auto">
              <div className="flex flex-col items-center justify-center lg:gap-4 gap-2">
                <Link
                  href={routes.vote.list(locale)}
                  className="grid lg:grid-cols-[60px_180px] grid-cols-[40px_100px] lg:w-[280px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center lg:w-14 w-10 ">
                    <Image
                      src={`/svg/drink-alcohol.svg`}
                      alt="Cocktails"
                      width={28}
                      height={28}
                      className="object-contain lg:w-8 w-7 lg:h-8 h-7"
                    />
                  </div>
                  <div className="text-left lg:w-[180px] w-[100px]">
                    <span className="lg:text-base text-sm font-medium leading-tight block whitespace-normal">
                      {t('seeAllCocktails')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="grid lg:grid-cols-[60px_180px] grid-cols-[40px_100px] lg:w-[280px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center lg:w-14 w-10 lg:h-14 h-10">
                    <Image
                      src={`/svg/Icon ion-ios-world-outline.svg`}
                      alt="World"
                      width={28}
                      height={28}
                      className="object-contain lg:w-9 w-7 lg:h-9 h-7"
                    />
                  </div>
                  <div className="text-left lg:w-[180px] w-[100px]">
                    <span className="lg:text-base text-sm font-medium leading-tight block whitespace-normal">
                      {t('checkAfterparty')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="grid lg:grid-cols-[60px_180px] grid-cols-[40px_100px] lg:w-[280px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center lg:w-14 w-10 lg:h-14 h-10">
                    <Image
                      src={`/svg/Icon fa-solid-map-location.svg`}
                      alt="Map"
                      width={28}
                      height={28}
                      className="object-contain lg:w-9 w-7 lg:h-9 h-7"
                    />
                  </div>
                  <div className="text-left lg:w-[180px] w-[100px]">
                    <span className="lg:text-base text-sm font-medium leading-tight block whitespace-normal">
                      {t('seeEventMap')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="https://www.instagram.com/helsinkidrinkfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid lg:grid-cols-[60px_180px] grid-cols-[40px_100px] lg:w-[280px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center lg:w-14 w-10 lg:h-14 h-10">
                    <Image
                      src={`/svg/instagram-fill.svg`}
                      alt="Instagram"
                      width={28}
                      height={28}
                      className="object-contain lg:w-9 w-7 lg:h-9 h-7"
                    />
                  </div>
                  <div className="text-left lg:w-[180px] w-[100px]">
                    <span className="lg:text-base text-sm font-medium leading-tight block whitespace-normal">
                      {t('followUs')}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
