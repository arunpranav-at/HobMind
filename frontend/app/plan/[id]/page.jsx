"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TechniqueCard from "../../../components/TechniqueCard";
import { fetchProgress, updateProgress, API_BASE } from "../../../lib/api";
import Confetti from "react-confetti";

export default function PlanDetailPage({ params }) {
  const planId = params?.id;
  const [plan, setPlan] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!planId) return;
    fetch(`${API_BASE}/api/plans/${planId}`)
      .then((r) => r.json())
      .then((data) => setPlan(data.plan));
  }, [planId]);

  useEffect(() => {
    fetchProgress().then((r) => {
      if (r?.progress) {
        const arr = Array.isArray(r.progress) ? r.progress : [];
        const map = {};
        arr.forEach((p) => {
          const hb = p.hobby || (p._doc && p._doc.hobby) || "";
          const t = p.techniqueUuid || p.techniqueId || (p._doc && p._doc.techniqueUuid) || "";
          const status = p.status || (p._doc && p._doc.status) || "";
          if (!hb || !t) return;
          map[hb] = map[hb] || {};
          map[hb][t] = status;
        });
        setProgressMap(map[plan?.hobby] || {});
      }
    });
  }, [plan]);

  async function onStatusChange(techId, status) {
    await updateProgress({ hobby: plan?.hobby, techniqueId: techId, status });
    const updated = { ...progressMap, [techId]: status };
    setProgressMap(updated);
    if (
      Object.values(updated).filter((v) => v === "mastered").length >=
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
              technique={t}
              onStatus={(s) => onStatusChange(t.uuid || t.id, s)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
