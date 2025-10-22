"use client"
import React, { useEffect, useState } from "react";
import { API_BASE } from "../../lib/api";
import Link from "next/link";

export default function AllPlansPage() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.hobby.toLowerCase().includes(search.toLowerCase()) ||
      plan.level.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:py-12 sm:px-6">
      <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-10 text-white text-center drop-shadow-lg animate-fade-in">All Plans</h2>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by hobby or level..."
          className="w-full max-w-md px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-black/60 border border-indigo-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow transition-all duration-200"
        />
      </div>
      <div className="glass p-6 sm:p-10 rounded-3xl shadow-2xl">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {filteredPlans.map((plan, idx) => (
            <li
              key={plan._id || plan.hobby + plan.level}
              className="bg-gradient-to-br from-black/90 via-indigo-900/80 to-black/80 p-8 rounded-2xl flex flex-col gap-3 shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-3xl animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="font-extrabold text-3xl text-white mb-2 tracking-wide flex items-center gap-2">
                <span className="inline-block animate-pop">{plan.hobby}</span>
              </div>
              <div className="text-lg text-gray-300 mb-4">Level: <span className="text-white font-semibold">{plan.level}</span></div>
              <Link
                href={`/plan/${plan._id}`}
                className="self-start px-6 py-2 rounded-full bg-blue-600 text-white font-bold text-lg shadow-md transition-all duration-300 hover:bg-blue-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop"
              >
                View Plan
              </Link>
            </li>
          ))}
          {filteredPlans.length === 0 && (
            <li className="text-gray-500 text-xl text-center animate-fade-in">No plans found.</li>
          )}
        </ul>
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
