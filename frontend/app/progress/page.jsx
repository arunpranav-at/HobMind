"use client"
import React, { useEffect, useState } from 'react'
import { fetchProgress } from '../../lib/api'

export default function ProgressPage(){
  const [progress, setProgress] = useState({})

  useEffect(()=>{ fetchProgress().then(r => setProgress(r.progress || {})) }, [])

  // Flatten progress array if needed
  const arr = Array.isArray(progress) ? progress : Object.values(progress).flat()
  const grouped = { 'mastered': [], 'in-progress': [], 'dropped': [] }
  arr.forEach(p => {
    if (grouped[p.status]) grouped[p.status].push(p)
  })

  return (
    <div className="relative z-20">
      <h2 className="text-3xl font-extrabold mb-4 text-white">Progress</h2>
      <div className="glass p-6 rounded-2xl">
        {['mastered','in-progress','dropped'].map(status => (
          <div key={status} className="mb-6">
            <h3 className={`text-xl font-bold mb-2 ${status === 'dropped' ? 'text-red-400' : status === 'mastered' ? 'text-green-400' : 'text-yellow-400'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
            <ul>
              {grouped[status].map((p, idx) => (
                <li key={p._id || idx} className={`mb-2 p-2 rounded-lg ${status === 'dropped' ? 'line-through bg-gray-900 text-red-400' : 'bg-gray-900'}`}>
                  <span className="font-semibold">{p.hobby}</span> — <span>{p.techniqueUuid}</span>
                </li>
              ))}
              {grouped[status].length === 0 && <li className="text-gray-500">No techniques</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
