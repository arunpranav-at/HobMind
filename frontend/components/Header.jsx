"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '../lib/store'

export default function Header(){
  const aura = useStore(s => s.auraPoints)
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{ setMounted(true); }, [])

  return (
    <header className="space-hero sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-center glass">
        <div className="w-full max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-2xl sm:text-3xl tracking-tight text-white">HobMind</Link>
            <div className="hidden sm:flex text-sm text-yellow-300 bg-black/20 px-3 py-1 rounded-full border border-yellow-600 items-center gap-2">
              <span>✨</span>
              <span className="font-semibold">{mounted ? (aura ?? 0) : 0}</span>
            </div>
          </div>

          {/* Mobile visible aura badge on the right */}
          <div className="flex items-center gap-2">
            <div className="sm:hidden text-sm text-yellow-300 bg-black/20 px-3 py-1 rounded-full border border-yellow-600 flex items-center gap-2">
              <span>✨</span>
              <span className="font-semibold">{mounted ? (aura ?? 0) : 0}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
