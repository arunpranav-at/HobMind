"use client"
import React, { useEffect } from 'react'

export default function AuraToast({ message, open, onClose }){
  useEffect(()=>{
    if (!open) return;
    const t = setTimeout(()=>onClose && onClose(), 3200);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed z-50 right-6 top-20 sm:top-20 sm:right-6 md:right-6 left-6 sm:left-auto flex justify-center sm:justify-end">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-3 rounded-xl shadow-lg border border-yellow-600 max-w-xs sm:max-w-sm truncate">
        <div className="font-semibold text-sm sm:text-base truncate">{message}</div>
      </div>
    </div>
  )
}
