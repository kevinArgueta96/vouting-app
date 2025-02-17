"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { routes } from "@/app/config/routes";
import { useEffect, useState, useCallback } from "react";

function useOptimalSize() {
  // Valores iniciales más apropiados para evitar flash
  const [size, setSize] = useState({ width: 320, height: 400 });

  const calculateSize = useCallback(() => {
    if (typeof window === "undefined") return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calcular espacio disponible considerando márgenes de seguridad
    const topSpace = 100; // Reducido el espacio para logo
    const bottomSpace = 150; // Aumentado el espacio para botones y padding
    const horizontalPadding = 48; // 24px a cada lado

    const availableHeight = viewportHeight - (topSpace + bottomSpace);
    const availableWidth = viewportWidth - horizontalPadding;

    // Ancho mínimo para el contenido
    const minContentWidth = 320;

    // Calcular dimensiones base manteniendo proporción y límites
    let width = Math.min(availableWidth, 500);
    let height = Math.min(availableHeight, 600);

    // Asegurar ancho mínimo
    width = Math.max(width, minContentWidth);

    // Mantener proporción 1.2 (más natural para el diseño)
    const aspectRatio = 1.2;

    // Ajustar dimensiones manteniendo el aspect ratio y asegurando espacio para contenido
    if (width * aspectRatio > height) {
      width = height / aspectRatio;
      // Asegurar que el ancho no sea menor que el contenido después del ajuste
      if (width < minContentWidth) {
        width = minContentWidth;
        height = width * aspectRatio;
      }
    } else {
      height = width * aspectRatio;
    }

    // Aplicar límites finales
    width = Math.min(Math.round(width), 500);
    height = Math.min(Math.round(height), 600);

    setSize({ width, height });
  }, []);

  useEffect(() => {
    calculateSize();
    const debouncedResize = debounce(calculateSize, 100);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [calculateSize]);

  return size;
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
  const { width, height } = useOptimalSize();

  return (
    <main className="min-h-screen bg-[#334798] relative flex flex-col">
      {/* Main logo */}
      <div className="flex justify-center mt-2 mb-3">
        <div
          className="bg-white w-[300px] h-[120px] flex items-center justify-center"
          style={{ borderRadius: "100% / 100%" }}
        >
          <Image
            src={`/svg/hdf_heslins_drink_logo.svg`}
            alt="HDF Helsinki Drink Festival"
            width={100} // Aumenta el ancho
            height={100} // Aumenta la altura
            style={{ width: "70%", height: "auto" }} // Asegura que no se distorsione
            priority
          />
        </div>
      </div>

      {/* Content section */}
      <div className="relative flex-grow">
        {/* Background SVG Container */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div
            className="relative transition-all duration-300 ease-in-out transform -mt-[32rem]"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              margin: "0 auto",
              top: "-15%",
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
              className="absolute right-[0%] bottom-[80%] w-[70px] "
              priority
            />
            <Image
              src="/images/thanks_coktail.png"
              alt="Thanks cocktail"
              width={150}
              height={150}
              className="absolute top-[15%] z-1 w-[70px]"
              priority
            />
            <Image
              src="/images/thanks_hand.png"
              alt="Thanks hand"
              width={150}
              height={150}
              className="absolute top-[70%] left-[60%] z-10 w-[180px]"
              priority
            />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-start p-20">
            {/* Thank you text */}
            <div className="mb-10">
              <div
                className="mx-auto text-white text-center uppercase flex flex-col mt-1"
                style={{
                  fontFamily: "Russo One",
                  fontSize: "2rem",
                  width: "100%",
                  letterSpacing: "-0.35px",
                  lineHeight: "1.1",
                }}
              >
                <span>{t('thankYouForVoting')}</span>
              </div>
            </div>

            {/* Options Container */}
            <div className="w-[180px] overflow-hidden mx-auto">
              <div className="flex flex-col items-center justify-center gap-2">
                <Link
                  href={routes.vote.list(locale)}
                  className="grid grid-cols-[40px_100px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center w-10 h-10">
                    <Image
                      src={`/svg/drink-alcohol.svg`}
                      alt="Cocktails"
                      width={28}
                      height={28}
                      className="object-contain w-7 h-7"
                    />
                  </div>
                  <div className="text-left w-[100px]">
                    <span className="text-sm font-medium leading-tight block whitespace-normal">
                      {t('seeAllCocktails')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="grid grid-cols-[40px_100px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center w-10 h-10">
                    <Image
                      src={`/svg/Icon ion-ios-world-outline.svg`}
                      alt="World"
                      width={28}
                      height={28}
                      className="object-contain w-7 h-7"
                    />
                  </div>
                  <div className="text-left w-[100px]">
                    <span className="text-sm font-medium leading-tight block whitespace-normal">
                      {t('checkAfterparty')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="#"
                  className="grid grid-cols-[40px_100px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center w-10 h-10">
                    <Image
                      src={`/svg/Icon fa-solid-map-location.svg`}
                      alt="Map"
                      width={28}
                      height={28}
                      className="object-contain w-7 h-7"
                    />
                  </div>
                  <div className="text-left w-[100px]">
                    <span className="text-sm font-medium leading-tight block whitespace-normal">
                      {t('seeEventMap')}
                    </span>
                  </div>
                </Link>

                <Link
                  href="https://www.instagram.com/helsinkidrinkfestival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[40px_100px] w-[180px] items-center text-white hover:opacity-80 transition-opacity gap-3 justify-center"
                >
                  <div className="flex items-center justify-center w-10 h-10">
                    <Image
                      src={`/svg/instagram-fill.svg`}
                      alt="Instagram"
                      width={28}
                      height={28}
                      className="object-contain w-7 h-7"
                    />
                  </div>
                  <div className="text-left w-[100px]">
                    <span className="text-sm font-medium leading-tight block whitespace-normal">
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
