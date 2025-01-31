'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { routes } from '../config/routes'
import { useState } from 'react'
import Drawer from './ui/drawer'

// Import SVG directly as a React component
import HDFLogo from '../../public/svg/hdf_word.svg'

export default function Header() {
  const locale = useLocale()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  return (
    <header className="w-full p-4 flex justify-between items-center bg-[#F9F6F0]">
      <Link href={routes.home(locale)} className="relative">
        <HDFLogo width={92} height={28} />
      </Link>
      <button 
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open menu"
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
