"use client"
import React, { useEffect, useState } from 'react'
import { fetchProgress } from '../../lib/api'

export default function ProgressPage(){
  const [progress, setProgress] = useState({})

  useEffect(()=>{ fetchProgress().then(r => setProgress(r.progress || {})) }, [])

  return (
    <div className="relative z-20">
      <h2 className="text-3xl font-extrabold mb-4 text-white">Progress</h2>
      <div className="glass p-6 rounded-2xl">
        <pre className="bg-transparent p-2 text-sm overflow-auto text-gray-200">{JSON.stringify(progress, null, 2)}</pre>
      </div>
    </div>
  )
}
