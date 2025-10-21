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
      <div className="w-full px-0 py-6 flex items-center justify-center glass">
        <Link href="/" className="font-extrabold text-3xl tracking-tight text-white">HobMind</Link>
      </div>
    </header>
  )
}

import PlanListSidebar from '../components/PlanListSidebar';

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-100">
        <div className="stars" aria-hidden="true"></div>
        <HydrateStore />
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 relative z-10">{children}</main>
      </body>
    </html>
  )
}
