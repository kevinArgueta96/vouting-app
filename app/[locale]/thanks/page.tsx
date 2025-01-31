"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ThanksPage() {
  const locale = useLocale();
  const t = useTranslations("Thanks");

  return (
    <main className="min-h-screen bg-[#2B3990] relative flex flex-col">
      {/* Main logo */}
      <div className="flex justify-center mt-2 mb-8">
        <div className="bg-white rounded-full p-5 inline-block">
          <Image
            src={`/svg/hdf_heslins_drink_logo.svg`}
            alt="HDF Helsinki Drink Festival"
            width={160}
            height={80}
            style={{ width: "auto" }}
            priority
          />
        </div>
      </div>

      {/* Content section */}
      <div className="rounded-tl-[50px] relative flex-grow">
        <div className="flex flex-col items-center">
          {/* SVG container with specific dimensions */}
          <div className="relative w-[329px] h-[148px] rounded-[51px] overflow-hidden mb-8">
            <Image
              src={`/svg/Grupo 500.svg`}
              alt="Background"
              width={329}
              height={148}
              className="w-full h-full object-cover"
            />
            <div className="text-white text-2xl font-bold absolute top-4 left-6">HDF</div>
          </div>

          {/* Content below SVG */}
          <div className="px-6 w-full max-w-sm mx-auto">
            {/* Thank you text */}
            <div className="mb-12">
              <Image
                src={`/svg/Thank you for voting!.svg`}
                alt="Thank you for voting!"
                width={280}
                height={40}
                className="mx-auto"
                style={{ width: "auto" }}
                priority
              />
            </div>

            {/* Options */}
            <div className="space-y-8">
              <Link
                href="#"
                className="flex items-center text-white gap-6 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={`/svg/Icon core-drink-alcohol.svg`}
                  alt="Cocktails"
                  width={28}
                  height={28}
                  style={{ width: "auto" }}
                />
                <span className="text-lg font-medium">
                  SEE ALL HDF COMPETITION COCKTAILS
                </span>
              </Link>

              <Link
                href="#"
                className="flex items-center text-white gap-6 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={`/svg/Icon ion-ios-world-outline.svg`}
                  alt="World"
                  width={28}
                  height={28}
                  style={{ width: "auto" }}
                />
                <span className="text-lg font-medium">CHECK THE AFTERPARTY</span>
              </Link>

              <Link
                href="#"
                className="flex items-center text-white gap-6 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={`/svg/Icon fa-solid-map-location.svg`}
                  alt="Map"
                  width={28}
                  height={28}
                  style={{ width: "auto" }}
                />
                <span className="text-lg font-medium">SEE THE EVENT MAP</span>
              </Link>

              <Link
                href="#"
                className="flex items-center text-white gap-6 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={`/svg/Icon akar-instagram-fill.svg`}
                  alt="Instagram"
                  width={28}
                  height={28}
                  style={{ width: "auto" }}
                />
                <span className="text-lg font-medium">FOLLOW US</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
