
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function TechniqueCard({ technique = {}, onStatus }){
  const [status, setStatus] = useState(technique.status || 'in-progress')

  function handleStatus(newStatus) {
    // Toggle drop: if already dropped, clicking again sets to in-progress
    let nextStatus = newStatus
    if (newStatus === 'dropped' && status === 'dropped') {
      nextStatus = 'in-progress'
    }
    setStatus(nextStatus)
    onStatus?.(nextStatus)
  }

  return (
    <motion.div layout whileHover={{ y: -6 }} className="tech-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className={`tech-title ${status === 'dropped' ? 'line-through text-red-400' : ''}`}>{technique.title}</h3>
          <p className={`tech-desc ${status === 'dropped' ? 'line-through text-red-400' : ''}`}>{technique.description}</p>
        </div>
        <div className="text-sm text-gray-400">{technique.uuid || technique.id}</div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className={`px-4 py-2 rounded-lg ${status === 'mastered' ? 'ring-2 ring-green-400' : ''}`} style={{background: 'linear-gradient(90deg,#22c55e,#16a34a)', color: 'white'}} onClick={() => handleStatus('mastered')}> Mastered</button>
        <button className={`px-4 py-2 rounded-lg ${status === 'in-progress' ? 'ring-2 ring-yellow-400' : ''}`} style={{background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: 'white'}} onClick={() => handleStatus('in-progress')}> In Progress</button>
        <button className={`px-4 py-2 rounded-lg ${status === 'dropped' ? 'ring-2 ring-red-400' : ''}`} style={{background: 'linear-gradient(90deg,#f43f5e,#ef4444)', color: 'white'}} onClick={() => handleStatus('dropped')}> Drop</button>
      </div>
    </motion.div>
  )
}

