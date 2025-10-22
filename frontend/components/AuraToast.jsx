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
    <div className="fixed top-20 right-6 z-50">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-3 rounded-xl shadow-lg border border-yellow-600">
        <div className="font-semibold">{message}</div>
      </div>
    </div>
  )
}
