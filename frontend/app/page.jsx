"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store'
import { generatePlan } from '../lib/api'

export default function Home(){
  const { hobby, level, setHobby, setLevel, setPlan } = useStore()
  const [loading, setLoading] = useState(false)

  async function onGenerate(e){
    e.preventDefault()
    setLoading(true)
    const result = await generatePlan(hobby, level)
    if (result?.plan) setPlan(result.plan)
    setLoading(false)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <section className="glass p-8 rounded-3xl shadow-lg relative z-20">
        <h1 className="text-5xl font-extrabold text-white">Make learning a hobby cosmic</h1>
        <p className="mt-3 text-lg text-gray-300">Type a hobby below and we'll generate 5–8 high-impact techniques tailored to your level. Fast growth, tiny daily wins.</p>
        <form className="mt-6 space-y-3" onSubmit={onGenerate}>
          <input value={hobby} onChange={e => setHobby(e.target.value)} className="w-full border border-white/6 rounded-lg bg-transparent px-4 py-3 text-white placeholder-gray-400" placeholder="Hobby (e.g. Guitar, Sketching)" />
          <select value={level} onChange={e => setLevel(e.target.value)} className="w-full border border-white/6 rounded-lg bg-black/20 px-4 py-3 text-white" style={{color: '#ffffff'}}>
            <option value="beginner" style={{color: '#000000'}}>Beginner</option>
            <option value="intermediate" style={{color: '#000000'}}>Intermediate</option>
            <option value="advanced" style={{color: '#000000'}}>Advanced</option>
          </select>
          <div className="flex gap-3">
            <button className="neon-btn" disabled={loading}>{loading ? 'Generating...' : 'Generate Plan'}</button>
            <Link href="/plan" className="px-6 py-3 border rounded-xl text-white/90">Open plan</Link>
          </div>
        </form>
      </section>

      <motion.section initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-6 rounded-2xl relative z-20">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-2xl font-semibold">Quick tips</h3>
          <ul className="mt-3 space-y-2 text-md text-gray-300">
            <li>Focus on 5–8 techniques — small wins compound.</li>
            <li>Mark what you master to earn XP and unlock badges.</li>
            <li>Drop techniques you dislike — keep the plan motivational.</li>
          </ul>
          <div className="mt-6">
            <Link href="/progress" className="inline-block px-4 py-2 neon-btn">View Progress</Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

