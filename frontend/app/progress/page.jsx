"use client"
import React, { useEffect, useState } from 'react'
// import { fetchProgress } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ProgressPage(){
  const [progress, setProgress] = useState([])

  // Progress endpoint removed; progress is now tracked in plans
  useEffect(()=>{ setProgress([]) }, [])

  // Group progress by hobby and level
  const arr = Array.isArray(progress) ? progress : Object.values(progress).flat();
  const hobbyLevelMap = {};
  arr.forEach(p => {
    const key = `${p.hobby} (${p.level})`;
    if (!hobbyLevelMap[key]) hobbyLevelMap[key] = [];
    hobbyLevelMap[key].push(p);
  });

  // Prepare chart data
  const chartData = Object.entries(hobbyLevelMap).map(([key, items]) => {
    const mastered = items.filter(i => i.status === 'mastered').length;
    const inProgress = items.filter(i => i.status === 'in-progress').length;
    const dropped = items.filter(i => i.status === 'dropped').length;
    return { name: key, Mastered: mastered, 'In Progress': inProgress, Dropped: dropped };
  });

  return (
    <div className="relative z-20">
      <h2 className="text-3xl font-extrabold mb-4 text-white">Progress</h2>
      <div className="glass p-6 rounded-2xl">
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-white">Progress Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#fff" tick={{ fill: '#fff', fontSize: 12 }} allowDecimals={false} />
              <Tooltip wrapperClassName="bg-black text-white rounded-lg p-2"/>
              <Legend />
              <Bar dataKey="Mastered" fill="#22c55e" />
              <Bar dataKey="In Progress" fill="#f59e0b" />
              <Bar dataKey="Dropped" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {Object.entries(hobbyLevelMap).map(([key, items]) => (
          <div key={key} className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-white">{key}</h3>
            <ul>
              {items.map((p, idx) => (
                <li key={p._id || idx} className={`mb-2 p-2 rounded-lg ${p.status === 'dropped' ? 'line-through bg-gray-900 text-red-400' : 'bg-gray-900'}`}>
                  <span className="font-semibold">{p.techniqueUuid}</span> — <span className="capitalize">{p.status}</span>
                </li>
              ))}
              {items.length === 0 && <li className="text-gray-500">No techniques</li>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
