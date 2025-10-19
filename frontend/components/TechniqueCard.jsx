import React from 'react'
import { motion } from 'framer-motion'

export default function TechniqueCard({ technique = {}, onStatus }){
  return (
    <motion.div layout whileHover={{ y: -6 }} className="tech-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="tech-title">{technique.title}</h3>
          <p className="tech-desc">{technique.description}</p>
        </div>
        <div className="text-sm text-gray-400">{technique.uuid || technique.id}</div>
      </div>
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 rounded-lg" style={{background: 'linear-gradient(90deg,#22c55e,#16a34a)', color: 'white'}} onClick={() => onStatus?.('mastered')}>✓ Mastered</button>
        <button className="px-4 py-2 rounded-lg" style={{background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: 'white'}} onClick={() => onStatus?.('in-progress')}>… In Progress</button>
        <button className="px-4 py-2 rounded-lg" style={{background: 'linear-gradient(90deg,#f43f5e,#ef4444)', color: 'white'}} onClick={() => onStatus?.('dropped')}>✕ Drop</button>
      </div>
    </motion.div>
  )
}

