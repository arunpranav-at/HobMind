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
  // const [plans, setPlans] = useState([])
  // const [progress, setProgress] = useState([])
  const router = useRouter()

  // Modal state for duplicate plan
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  // No need to fetch plans or progress from backend here

  async function onGenerate(e){
    e.preventDefault()
    setLoading(true)
    // No need to check for existing plan in frontend
    // If not exists, proceed to generate and save
    try {
      const result = await generatePlan(hobby, level)
      if (result?.plan) {
        setPlan(result.plan)
        const saveResult = await savePlan(result.plan);
        if (saveResult && saveResult.duplicate) {
          setShowDuplicateModal(true);
        } else {
          router.push('/plan');
        }
      }
    } catch (err) {
      // If generatePlan fails with 409, show modal
      if (err.message && err.message.includes('409')) {
        setShowDuplicateModal(true);
        // Do not log duplicate error
      } else {
        console.warn('Failed to generate plan', err);
      }
    }
    setLoading(false)
  }

  return (
  <div className="bg-gradient-to-b from-gray-950 to-black text-white relative">
      {/* Duplicate Plan Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center border border-purple-500">
            <h2 className="text-xl font-bold mb-2">Plan Already Exists</h2>
            <p className="mb-4 text-gray-300">A plan for this hobby and level already exists or was generated.<br/>You can view all your plans or progress below.</p>
            <div className="flex gap-4 justify-center mb-4">
              <Link href="/allplans" className="neon-btn px-4 py-2">View All Plans</Link>
              <Link href="/allprogress" className="neon-btn px-4 py-2">View All Progress</Link>
            </div>
            <button className="mt-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white" onClick={() => setShowDuplicateModal(false)}>Close</button>
          </div>
        </div>
      )}
  <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto p-8 py-8 rounded-3xl bg-black/70 backdrop-blur-md shadow-2xl border border-purple-900">
  {/* Left Sidebar: Saved Plans */}
  <aside className="col-span-3 space-y-4 flex flex-col">
          <div className="glass p-6 rounded-2xl shadow-xl shadow-purple-500/10 h-[420px] overflow-auto border-r border-gray-800 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
              <h3 className="text-2xl font-semibold text-center mb-2">Saved Plans</h3>
              <div className="space-y-3">
                <div className="text-gray-500">Use this to view all generated plans and also to mark them as complete, in-progress, or dropped.</div>
              </div>
            <div className="mt-4 flex justify-center">
              <Link href="/allplans" className="px-4 py-2 neon-btn">View All Plans</Link>
            </div>
          </div>
        </aside>

        {/* Center: Hero Section */}
        <main className="col-span-6 flex flex-col items-center justify-center space-y-6 text-center">
          <section className="glass p-8 rounded-3xl shadow-xl shadow-purple-500/10 w-full max-w-lg mx-auto flex flex-col items-center justify-center h-[420px] overflow-auto transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
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
              </div>
            </form>
          </section>
        </main>

  {/* Right Sidebar: Progress */}
  <aside className="col-span-3 space-y-4 flex flex-col">
          <motion.section initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="glass p-6 rounded-2xl shadow-xl shadow-purple-500/10 h-[420px] flex flex-col overflow-auto transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg">
            <h3 className="text-2xl font-semibold text-center mb-2">Progress</h3>
            <div className="space-y-3">
              <div className="text-gray-500">Use this to view all status of your learning progress along with visualization and nicely categorized techniques.</div>
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

