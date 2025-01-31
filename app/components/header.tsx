'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { routes } from '../config/routes'

export default function Header() {
  const locale = useLocale()
  
  return (
    <header className="w-full p-4 flex justify-between items-center bg-[#F9F6F0]">
      <Link href={routes.home(locale)} className="relative w-[92px] h-7">
        <Image
          src="/svg/hdf_word.svg"
          alt="HDF Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Link>
      <button className="text-[#37529B]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
        </svg>
      </button>
    </header>
  )
}
