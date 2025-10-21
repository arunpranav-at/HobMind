"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store'
import { generatePlan, savePlan } from '../lib/api'


export default function Home() {
  const { hobby, level, setHobby, setLevel, setPlan } = useStore()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState([])
  const [progress, setProgress] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE + '/api/plans')
      .then(r => r.json())
      .then(data => setPlans(data.plans || []))
      .catch(() => setPlans([]));
    fetch(process.env.NEXT_PUBLIC_API_BASE + '/api/progress')
      .then(r => r.json())
      .then(data => setProgress(data.progress || []))
      .catch(() => setProgress([]));
  }, [])

  async function onGenerate(e){
    e.preventDefault()
    setLoading(true)
    const result = await generatePlan(hobby, level)
    if (result?.plan) {
      setPlan(result.plan)
      try {
        await savePlan(result.plan);
      } catch (err) {
        console.warn('Failed to persist plan to backend', err);
      }
      router.push('/plan')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto p-8">
  {/* Left Sidebar: Saved Plans */}
  <aside className="col-span-3 space-y-4 flex flex-col">
          <div className="glass p-6 rounded-2xl shadow-xl shadow-purple-500/10 h-full min-h-[420px] border-r border-gray-800 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
              <h3 className="text-2xl font-semibold text-center mb-2">Saved Plans</h3>
              <div className="space-y-3">
                {plans.length === 0 && <div className="text-gray-500">No plans found.</div>}
                {plans.length > 0 && plans.slice(0,3).map(plan => (
                  <div
                    key={plan._id || plan.hobby + plan.level}
                    className="bg-black/80 p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-700"
                    onClick={() => {
                      setPlan(plan);
                      setHobby(plan.hobby);
                      setLevel(plan.level);
                      router.push('/plan');
                    }}
                  >
                    <div className="font-semibold">{plan.hobby}</div>
                    <div className="text-xs text-gray-300">Level: {plan.level}</div>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link href="/allplans" className="px-4 py-2 neon-btn">View All Plans</Link>
            </div>
          </div>
        </aside>

        {/* Center: Hero Section */}
        <main className="col-span-6 flex flex-col items-center justify-center space-y-6 text-center">
          <section className="glass p-8 rounded-3xl shadow-xl shadow-purple-500/10 w-full max-w-lg mx-auto flex flex-col items-center justify-center h-full min-h-[420px] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
            <h1 className="text-4xl font-bold text-white text-center mb-2">Make learning a hobby cosmic</h1>
            <p className="text-gray-400 text-center max-w-md mx-auto mb-4 text-base">Type a hobby below and we'll generate 5–8 high-impact techniques tailored to your level. Fast growth, tiny daily wins.</p>
            <form className="space-y-4 w-full" onSubmit={onGenerate}>
              <input value={hobby} onChange={e => setHobby(e.target.value)} className="w-full border border-white/10 rounded-lg bg-transparent px-4 py-3 text-white placeholder-gray-400" placeholder="Hobby (e.g. Guitar, Sketching)" />
              <select value={level} onChange={e => setLevel(e.target.value)} className="w-full border border-white/10 rounded-lg bg-black/20 px-4 py-3 text-white" style={{color: '#ffffff'}}>
                <option value="beginner" style={{color: '#000000'}}>Beginner</option>
                <option value="intermediate" style={{color: '#000000'}}>Intermediate</option>
                <option value="advanced" style={{color: '#000000'}}>Advanced</option>
              </select>
              <div className="flex gap-4 justify-center">
                <button className="neon-btn transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-lg" disabled={loading}>{loading ? 'Generating...' : 'Generate Plan'}</button>
                <Link href="/plan" className="px-6 py-3 border rounded-xl text-white/90 transition-all duration-300 ease-in-out hover:scale-[1.05] hover:shadow-lg">Open plan</Link>
              </div>
            </form>
          </section>
        </main>

  {/* Right Sidebar: Progress */}
  <aside className="col-span-3 space-y-4 flex flex-col">
          <motion.section initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass p-6 rounded-2xl shadow-xl shadow-purple-500/10 h-full min-h-[420px] flex flex-col transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-center mb-2">Progress</h3>
            <div className="space-y-3">
              {progress.length === 0 && <div className="text-gray-500">No progress found.</div>}
              {progress.slice(0,3).map((p, idx) => (
                <div key={p._id || idx} className={`bg-gray-900 p-3 rounded-lg ${p.status === 'dropped' ? 'line-through text-red-400' : ''}`}>
                  <div className="font-semibold">{p.hobby}</div>
                  <div className="text-xs text-gray-300">Technique: {p.techniqueUuid}</div>
                  <div className={`text-xs ${p.status === 'dropped' ? 'text-red-400' : p.status === 'mastered' ? 'text-green-400' : 'text-yellow-400'}`}>Status: {p.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Link href="/allprogress" className="px-4 py-2 neon-btn">View All Progress</Link>
            </div>
          </motion.section>
        </aside>
      </div>
    </div>
  )
}

