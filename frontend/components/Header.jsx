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
      <div className="w-full px-0 py-6 flex items-center justify-center glass">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-extrabold text-3xl tracking-tight text-white">HobMind</Link>
          <div className="text-sm text-yellow-300 bg-black/20 px-3 py-1 rounded-full border border-yellow-600 flex items-center gap-2">
            <span>✨</span>
            <span className="font-semibold">{mounted ? (aura ?? 0) : 0}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
