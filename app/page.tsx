"use client";

import { Button } from "./components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-[#3B3BAA] relative">
      {/* Top pink section */}
      <div className="w-full bg-[#FBD9D9] py-8">
        <h1 className="text-4xl md:text-6xl font-sans text-center font-bold">
          HDF
        </h1>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative flex justify-center items-center">
          {/* Left drink */}
          <div className="absolute left-0 md:left-20 -translate-x-1/4 md:translate-x-0 transform hover:-translate-y-2 transition-transform">
            <Image
              src="/drinks/left-drink.svg"
              alt="Blue bottle drink"
              width={150}
              height={200}
              className="w-32 md:w-48 h-auto"
            />
          </div>

          {/* Center drink */}
          <div className="z-10 transform hover:scale-105 transition-transform">
            <Image
              src="/drinks/main-drink.svg"
              alt="Pink cocktail"
              width={200}
              height={300}
              className="w-48 md:w-64 h-auto"
              priority
            />
          </div>

          {/* Right drink */}
          <div className="absolute right-0 md:right-20 translate-x-1/4 md:translate-x-0 transform hover:-translate-y-2 transition-transform">
            <Image
              src="/drinks/right-drink.svg"
              alt="Orange wine glass"
              width={150}
              height={200}
              className="w-32 md:w-48 h-auto"
            />
          </div>
        </div>

        {/* Vote text */}
        <h2 className="text-center text-white font-sans font-semibold text-xl md:text-2xl mt-16 mb-12">
          VOTE FOR THE BEST FLAVOR
        </h2>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            className="bg-white text-[#3B3BAA] hover:bg-white/90 hover:scale-105 transform transition-all text-lg px-8 py-6"
            size="lg"
            onClick={() => router.push('/cocktail')}
          >
            GET STARTED
          </Button>
        </div>
      </div>

      {/* Emojis */}
      <div 
        className="absolute top-4 right-4 text-4xl md:text-5xl emoji-happy" 
        role="img" 
        aria-label="Happy face"
        style={{ filter: 'hue-rotate(85deg) saturate(1.5)' }}
      >
        😊
      </div>
      <div 
        className="absolute bottom-12 left-4 text-4xl md:text-5xl emoji-sad" 
        role="img" 
        aria-label="Sad face"
        style={{ filter: 'hue-rotate(-45deg) saturate(1.5)' }}
      >
        😢
      </div>
    </main>
  )
}
