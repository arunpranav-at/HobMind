"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { API_BASE } from "../lib/api";

export default function PlanListSidebar() {
  const { setPlan, setHobby, setLevel } = useStore();
  const [plans, setPlans] = useState([]);
  const [progress, setProgress] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
    fetch(`${API_BASE}/api/progress`)
      .then((r) => r.json())
      .then((data) => setProgress(data.progress || []));
  }, []);

  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
  function handleSelectPlan(plan) {
    setSelected(plan.hobby + "-" + plan.level);
    setPlan(plan);
    setHobby(plan.hobby);
    setLevel(plan.level);
    if (router) router.push('/plan');
  }

  return (
    <aside className="w-72 bg-black/80 text-white h-full p-4 border-r border-gray-800 overflow-y-auto" style={{ minWidth: '288px' }}>
      <h3 className="text-lg font-bold mb-2">Saved Plans</h3>
      <ul className="mb-6">
        {plans.map((plan) => (
          <li
            key={plan._id || plan.hobby + plan.level}
            className={`mb-2 cursor-pointer p-2 rounded-lg hover:bg-gray-700 ${selected === plan.hobby + "-" + plan.level ? "bg-gray-700" : ""}`}
            onClick={() => handleSelectPlan(plan)}
          >
            <div className="font-semibold">{plan.hobby}</div>
            <div className="text-xs text-gray-300">Level: {plan.level}</div>
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-bold mb-2">Progress</h3>
      <ul>
        {progress.map((p, idx) => (
          <li key={p._id || idx} className="mb-2 p-2 rounded-lg bg-gray-900">
            <div className="font-semibold">{p.hobby}</div>
            <div className="text-xs text-gray-300">Technique: {p.techniqueUuid}</div>
            <div className="text-xs text-green-400">Status: {p.status}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
