"use client"
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import Link from "next/link";

export default function AllPlansPage() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">All Plans</h2>
      <div className="glass p-6 rounded-2xl shadow-xl">
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li key={plan._id || plan.hobby + plan.level} className="bg-black/80 p-4 rounded-lg flex flex-col gap-1">
              <div className="font-semibold text-lg">{plan.hobby}</div>
              <div className="text-xs text-gray-300 mb-2">Level: {plan.level}</div>
              <Link href={`/plan/${plan._id}`} className="text-blue-400 underline">View Plan</Link>
            </li>
          ))}
          {plans.length === 0 && <li className="text-gray-500">No plans found.</li>}
        </ul>
      </div>
    </div>
  );
}
