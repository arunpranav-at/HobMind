"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TechniqueCard from "../../../components/TechniqueCard";
import { API_BASE } from "../../../lib/api";
import Confetti from "react-confetti";

export default function PlanDetailPage({ params }) {
  const { id: planId } = React.use(params);
  const [plan, setPlan] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!planId) return;
    fetch(`${API_BASE}/api/plans/${planId}`)
      .then((r) => r.json())
      .then((data) => setPlan(data.plan));
  }, [planId]);

  // No need to fetch progress separately; use plan.techniques status

  async function onStatusChange(techId, status) {
    // Only update local plan state, no API call
    const updatedTechniques = (plan?.techniques || []).map((t) =>
      t.uuid === techId ? { ...t, status } : t
    );
    setPlan({ ...plan, techniques: updatedTechniques });
    if (
      updatedTechniques.filter((t) => t.status === "mastered").length >=
      (plan?.techniques?.length || 3)
    ) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }

  if (!plan) return <div className="text-center text-gray-500">No plan found.</div>;

  return (
    <div className="relative z-20">
      {showConfetti && <Confetti />}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-4xl font-extrabold mb-2 text-white">{plan.hobby}</h2>
        <div className="text-sm text-gray-300 mb-4">
          Level: <strong className="ml-1 text-white">{plan.level}</strong>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {(plan.techniques || []).map((t) => (
            <TechniqueCard
              key={t.uuid || t.id}
              technique={{...t, showStatusButtons: false}}
              status={t.status}
              onStatus={(s) => onStatusChange(t.uuid || t.id, s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
