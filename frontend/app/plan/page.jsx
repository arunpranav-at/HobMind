"use client"
import React, { useEffect, useState } from 'react'
import TechniqueCard from '../../components/TechniqueCard'
import { useStore } from '../../lib/store'
// import { fetchProgress, updateProgress } from '../../lib/api'
import Confetti from 'react-confetti'

export default function PlanPage(){
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { hobby, plan, setPlan, setProgress } = useStore()
  const [localPlan, setLocalPlan] = useState(plan)
  const [progressMap, setProgressMap] = useState({})
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(()=>{
    setLocalPlan(plan)
    // Progress is now tracked in plan.techniques, no need to fetch separately
    if (plan && plan.techniques) {
      const map = {};
      plan.techniques.forEach(t => {
        map[t.uuid || t.id] = t.status || 'not-started';
      });
      setProgressMap(map);
    }
  }, [plan, hobby, setProgress])

  async function onStatusChange(techId, status){
    // Update local plan technique status only
    const updated = { ...progressMap, [techId]: status }
    setProgressMap(updated)
    if (Object.values(updated).filter(v => v === 'mastered').length >= (localPlan?.techniques?.length || 3)){
      setShowConfetti(true)
      setTimeout(()=>setShowConfetti(false), 5000)
    }
  }

  if (!mounted) return null;
  if (!localPlan) return <div className="text-center text-gray-500">No plan yet — generate one on the home page.</div>;

  return (
    <div className="relative z-20">
      {showConfetti && <Confetti />}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-4xl font-extrabold mb-2 text-white">{localPlan.hobby}</h2>
        <div className="text-sm text-gray-300 mb-4">Level: <strong className="ml-1 text-white">{localPlan.level}</strong></div>
        <div className="grid md:grid-cols-2 gap-6">
          {(localPlan.techniques || []).map(t => (
            <TechniqueCard key={t.uuid || t.id} technique={t} onStatus={(s)=>onStatusChange(t.uuid || t.id, s)} />
          ))}
        </div>
      </div>
    </div>
  )
}
