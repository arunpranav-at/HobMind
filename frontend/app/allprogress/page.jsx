"use client"
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";

export default function AllProgressPage() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  // Group by hobby and level, filter by search
  const hobbyLevelMap = {};
  plans.forEach((plan) => {
    if (
      plan.hobby.toLowerCase().includes(search.toLowerCase()) ||
      plan.level.toLowerCase().includes(search.toLowerCase())
    ) {
      const key = `${plan.hobby} (${plan.level})`;
      hobbyLevelMap[key] = plan;
    }
  });

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg animate-fade-in">All Progress</h2>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by hobby or level..."
          className="w-full max-w-md px-5 py-3 rounded-full bg-black/60 border border-indigo-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-200"
        />
      </div>
      <div className="glass p-10 rounded-3xl shadow-2xl">
        {Object.entries(hobbyLevelMap).map(([key, plan], idx) => {
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
            <div key={key} className="mb-10 animate-fade-in" style={{ animationDelay: `${idx * 120}ms` }}>
              <div className="bg-gradient-to-br from-black/90 via-indigo-900/80 to-black/80 p-8 rounded-2xl shadow-2xl border border-indigo-900/40">
                <h3 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
                  <span className="inline-block animate-pop">{key}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {['pending', 'in-progress', 'mastered', 'dropped', 'not-started'].map((status) => (
                    <div key={status} className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md
                          ${status === 'mastered' ? 'bg-green-600 text-white' :
                            status === 'dropped' ? 'bg-red-600 text-white' :
                            status === 'in-progress' ? 'bg-yellow-500 text-black' :
                            status === 'pending' ? 'bg-gray-500 text-white' :
                            'bg-gray-700 text-white'}
                        `}>
                          {status.replace('-', ' ')}
                        </span>
                      </div>
                      <ul className="space-y-3">
                        {grouped[status].length > 0 ? grouped[status].map((tech) => (
                          <li key={tech.uuid} className="p-4 rounded-xl bg-black/60 text-white shadow-xl flex flex-col gap-1 border border-gray-800 hover:scale-[1.03] transition-transform duration-200 animate-pop">
                            <span className="font-bold text-lg mb-1">{tech.title}</span>
                            <span className="text-sm text-gray-300">{tech.description}</span>
                            <button className="mt-2 self-end px-4 py-1 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-400 hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 animate-pop">Details</button>
                          </li>
                        )) : <li className="text-gray-500 text-base">No techniques</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {plans.length === 0 && <div className="text-gray-500 text-xl text-center animate-fade-in">No progress found.</div>}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes pop {
          0% { transform: scale(0.95); }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
}
