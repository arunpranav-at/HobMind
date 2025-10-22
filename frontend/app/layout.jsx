import '../styles/globals.css'
import React from 'react'
import Link from 'next/link'
import HydrateStore from '../components/HydrateStore'
import Header from '../components/Header'

export const metadata = {
  title: 'HobMind',
  description: 'Learn hobbies efficiently',
}

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-100">
        <div className="stars" aria-hidden="true"></div>
        <HydrateStore />
        <Header />
        {/* Constrain content but allow padding on small screens */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 relative z-10">{children}</main>
      </body>
    </html>
  )
}
