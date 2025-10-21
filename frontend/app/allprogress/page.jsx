"use client"
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";

export default function AllProgressPage() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  // Group by hobby and level
  const hobbyLevelMap = {};
  plans.forEach((plan) => {
    const key = `${plan.hobby} (${plan.level})`;
    hobbyLevelMap[key] = plan;
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">All Progress</h2>
      <div className="glass p-6 rounded-2xl shadow-xl">
        {Object.entries(hobbyLevelMap).map(([key, plan]) => {
          // Group techniques by status
          const grouped = {
            mastered: [],
            dropped: [],
            'in-progress': [],
            pending: [],
            'not-started': []
          };
          (plan?.techniques || []).forEach((tech) => {
            const status = tech.status || 'not-started';
            if (status === 'mastered') grouped.mastered.push(tech);
            else if (status === 'dropped') grouped.dropped.push(tech);
            else if (status === 'in-progress') grouped['in-progress'].push(tech);
            else if (status === 'not-started') grouped['not-started'].push(tech);
            else grouped.pending.push(tech);
          });
          return (
            <div key={key} className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-white">{key}</h3>
              {['pending', 'in-progress', 'mastered', 'dropped', 'not-started'].map((status) => (
                <div key={status} className="mb-2">
                  <div className="text-md font-semibold text-gray-300 mb-1 capitalize">{status.replace('-', ' ')}</div>
                  <ul className="space-y-2">
                    {grouped[status].length > 0 ? grouped[status].map((tech) => (
                      <li key={tech.uuid} className={`p-2 rounded-lg bg-gray-900 text-white`}>
                        <span className="font-semibold">{tech.title}</span>
                        <span className="ml-2 text-xs text-gray-400">{tech.description}</span>
                      </li>
                    )) : <li className="text-gray-500">No techniques</li>}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
        {plans.length === 0 && <div className="text-gray-500">No progress found.</div>}
      </div>
    </div>
  );
}
