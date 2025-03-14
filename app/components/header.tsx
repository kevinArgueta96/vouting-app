'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Drawer from './ui/drawer'

// Import SVG directly as a React component
import HDFLogo from '../../public/svg/hdf_word.svg'
import HDFLogoWhite from '../../public/svg/hdf_word_withe.svg'

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const isDarkHeader = pathname === `/${locale}` || pathname === `/${locale}/thanks`
  
  return (
    <header className={`w-full p-4 flex justify-between items-center ${isDarkHeader ? 'bg-vouting-blue' : 'bg-[#F9F6F0]'}`}>
      {/* <Link href={routes.home(locale)} className="relative"> */}
        {isDarkHeader ? (
          <HDFLogoWhite width={92} height={28} />
        ) : (
          <HDFLogo width={92} height={28} />
        )}
      {/* </Link> */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open menu"
        className={isDarkHeader ? 'text-white' : ''}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
        </svg>
      </button>
      <Drawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  )
}
