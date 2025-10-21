"use client"
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";

export default function AllProgressPage() {
  const [progress, setProgress] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/api/progress`)
      .then((r) => r.json())
      .then((data) => setProgress(data.progress || []));
  }, []);

  // Group by hobby and level
  const hobbyLevelMap = {};
  progress.forEach((p) => {
    const key = `${p.hobby} (${p.level})`;
    if (!hobbyLevelMap[key]) hobbyLevelMap[key] = [];
    hobbyLevelMap[key].push(p);
  });

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">All Progress</h2>
      <div className="glass p-6 rounded-2xl shadow-xl">
        {Object.entries(hobbyLevelMap).map(([key, items]) => (
          <div key={key} className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-white">{key}</h3>
            <ul className="space-y-2">
              {items.map((p, idx) => (
                <li key={p._id || idx} className={`p-2 rounded-lg ${p.status === 'dropped' ? 'line-through bg-gray-900 text-red-400' : 'bg-gray-900'}`}>
                  <span className="font-semibold">{p.techniqueUuid}</span> — <span className="capitalize">{p.status}</span>
                </li>
              ))}
              {items.length === 0 && <li className="text-gray-500">No techniques</li>}
            </ul>
          </div>
        ))}
        {progress.length === 0 && <div className="text-gray-500">No progress found.</div>}
      </div>
    </div>
  );
}
