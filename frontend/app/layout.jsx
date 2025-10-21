import '../styles/globals.css'
import React from 'react'
import Link from 'next/link'
import HydrateStore from '../components/HydrateStore'

export const metadata = {
  title: 'HobMind',
  description: 'Learn hobbies efficiently',
}

function Header(){
  return (
    <header className="space-hero sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between glass">
        <Link href="/" className="font-extrabold text-3xl tracking-tight text-white">HobMind</Link>
        <nav className="space-x-4">
          <Link href="/plan" className="px-4 py-2 bg-white/6 backdrop-blur rounded-lg hover:bg-white/10 neon-btn">Plan</Link>
          <Link href="/progress" className="px-4 py-2 bg-white/6 backdrop-blur rounded-lg hover:bg-white/10 neon-btn">Progress</Link>
        </nav>
      </div>
    </header>
  )
}

import PlanListSidebar from '../components/PlanListSidebar';

export default function RootLayout({ children }){
  return (
    <html lang="en">
    "use client";
    <body className="min-h-screen text-gray-100">
        <div className="stars" aria-hidden="true"></div>
        <HydrateStore />
        <Header />
        <div className="flex">
          <PlanListSidebar />
          <main className="flex-1 max-w-6xl mx-auto px-4 py-8 relative z-10">{children}</main>
        </div>
      </body>
    </html>
  )
}
