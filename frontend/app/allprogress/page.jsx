"use client";
import React, { useEffect, useState } from "react";
import { API_BASE, savePlan } from "../../lib/api";

export default function AllProgressPage() {
  // ...existing code...
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState({ open: false, url: "", title: "" });
  const [modal, setModal] = useState({ open: false, plan: null });
  const [modalLoading, setModalLoading] = useState(false);
  const [initialModalOpened, setInitialModalOpened] = useState(false);

  // Read query params for hobby and level
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hobbyParam = params.get('hobby');
      const levelParam = params.get('level');
      if (plans.length > 0 && hobbyParam && levelParam && !initialModalOpened) {
        const match = plans.find(p => p.hobby === hobbyParam && p.level === levelParam);
        if (match) {
          setModal({ open: true, plan: match });
          setInitialModalOpened(true);
        }
      }
    }
  }, [plans, initialModalOpened]);
  // ...existing code...

  useEffect(() => {
    fetch(`${API_BASE}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(data.plans || []));
  }, []);

  // Group by hobby and level, filter by search
  const filteredPlans = plans.filter(
    (plan) =>
      plan.hobby.toLowerCase().includes(search.toLowerCase()) ||
      plan.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg animate-fade-in">
          All Progress
        </h2>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hobby or level..."
            className="w-full max-w-md px-5 py-3 rounded-full bg-black/60 border border-indigo-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-all duration-200"
          />
        </div>

        <div className="glass p-10 rounded-3xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPlans.map((plan, idx) => (
              <div
                key={plan._id || plan.hobby + plan.level}
                className="bg-gradient-to-br from-black/90 via-indigo-900/80 to-black/80 p-8 rounded-2xl flex flex-col gap-3 shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-3xl animate-fade-in cursor-pointer"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setModal({ open: true, plan })}
              >
                <div className="font-extrabold text-3xl text-white mb-2 tracking-wide flex items-center gap-2">
                  <span className="inline-block animate-pop">{plan.hobby}</span>
                </div>
                <div className="text-lg text-gray-300 mb-4">
                  Level:{" "}
                  <span className="text-white font-semibold">{plan.level}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {plan.techniques?.length || 0} techniques
                  <p className="text-sm text-gray-300 italic">Click to view details</p>
                </div>
              </div>
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-gray-500 text-xl text-center animate-fade-in">
              No progress found.
            </div>
          )}
        </div>

        {/* Modal for plan details and technique status */}
        {modal.open && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
             <div
               className="bg-gray-900 rounded-2xl p-6 shadow-2xl max-w-2xl w-full text-left border border-indigo-500 overflow-y-auto z-50"
               style={{ maxHeight: '80vh', marginTop: '40px' }}
             >
               <div className="flex justify-between items-center mb-4">
                <div>
                   <h2 className="text-3xl font-extrabold mb-1 text-white">
                     {modal.plan.hobby}
                   </h2>
                   {/* Progress Bar */}
                   {(() => {
                     const total = modal.plan.techniques?.length || 0;
                     const mastered = modal.plan.techniques?.filter(t => t.status === 'mastered').length || 0;
                     const percent = total ? Math.round((mastered / total) * 100) : 0;
                     return (
                       <div className="w-full my-2">
                         <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                           <div
                             className="h-4 bg-green-500 rounded-full transition-all duration-500"
                             style={{ width: `${percent}%` }}
                           ></div>
                         </div>
                         <div className="text-xs text-gray-300 mt-1 text-right">{percent}% mastered</div>
                       </div>
                     );
                   })()}
                  <div className="text-lg text-gray-300 mb-2">
                    Level:{" "}
                    <span className="text-white font-semibold">
                      {modal.plan.level}
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                  onClick={() => setModal({ open: false, plan: null })}
                >
                  Close
                </button>
              </div>

              {/* Group techniques by status */}
               {["mastered", "in-progress", "dropped", "not-started"].map(
                 (status) => (
                  <div key={status} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md
                          ${
                            status === "mastered"
                              ? "bg-green-600 text-white"
                              : status === "dropped"
                              ? "bg-red-600 text-white"
                              : status === "in-progress"
                              ? "bg-yellow-500 text-black"
                              : status === "pending"
                              ? "bg-gray-500 text-white"
                              : "bg-gray-700 text-white"
                          }`}
                      >
                        {status.replace("-", " ")}
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {modal.plan.techniques?.filter(
                        (t) => (t.status || "not-started") === status
                      ).length > 0 ? (
                        modal.plan.techniques
                          .filter((t) => (t.status || "not-started") === status)
                          .map((tech) => (
                            <li
                              key={tech.uuid || tech.id}
                              className="p-4 rounded-xl bg-black/60 text-white shadow-xl flex flex-col gap-1 border border-gray-800"
                            >
                              <span className="font-bold text-lg mb-1">
                                {tech.title}
                              </span>
                              <span className="text-sm text-gray-300">
                                {tech.description}
                              </span>

                              <div className="flex gap-2 mt-2 flex-wrap">
                                <button
                                  className={`px-4 py-2 rounded-lg ${
                                    tech.status === "mastered"
                                      ? "ring-2 ring-green-400"
                                      : ""
                                  }`}
                                  style={{
                                    background:
                                      "linear-gradient(90deg,#22c55e,#16a34a)",
                                    color: "white",
                                  }}
                                  disabled={modalLoading}
                                  onClick={async () => {
                                    setModalLoading(true);
                                    const updatedTechniques =
                                      modal.plan.techniques.map((t) =>
                                        t.uuid === tech.uuid
                                          ? { ...t, status: "mastered" }
                                          : t
                                      );
                                    // Persist status update
                                    await import('../../lib/api').then(({ updatePlan }) => updatePlan(modal.plan._id, updatedTechniques));
                                    setModal({
                                      open: true,
                                      plan: {
                                        ...modal.plan,
                                        techniques: updatedTechniques,
                                      },
                                    });
                                    setPlans(prevPlans => prevPlans.map(p =>
                                      p._id === modal.plan._id
                                        ? { ...p, techniques: updatedTechniques }
                                        : p
                                    ));
                                    setModalLoading(false);
                                  }}
                                >
                                  🎓 Mastered
                                </button>

                                <button
                                  className={`px-4 py-2 rounded-lg ${
                                    tech.status === "in-progress"
                                      ? "ring-2 ring-yellow-400"
                                      : ""
                                  }`}
                                  style={{
                                    background:
                                      "linear-gradient(90deg,#f59e0b,#f97316)",
                                    color: "white",
                                  }}
                                  disabled={modalLoading}
                                  onClick={async () => {
                                    setModalLoading(true);
                                    const updatedTechniques =
                                      modal.plan.techniques.map((t) =>
                                        t.uuid === tech.uuid
                                          ? { ...t, status: "in-progress" }
                                          : t
                                      );
                                    await import('../../lib/api').then(({ updatePlan }) => updatePlan(modal.plan._id, updatedTechniques));
                                    setModal({
                                      open: true,
                                      plan: {
                                        ...modal.plan,
                                        techniques: updatedTechniques,
                                      },
                                    });
                                    setPlans(prevPlans => prevPlans.map(p =>
                                      p._id === modal.plan._id
                                        ? { ...p, techniques: updatedTechniques }
                                        : p
                                    ));
                                    setModalLoading(false);
                                  }}
                                >
                                  🚧 In Progress
                                </button>

                                <button
                                  className={`px-4 py-2 rounded-lg ${
                                    tech.status === "dropped"
                                      ? "ring-2 ring-red-400"
                                      : ""
                                  }`}
                                  style={{
                                    background:
                                      "linear-gradient(90deg,#f43f5e,#ef4444)",
                                    color: "white",
                                  }}
                                  disabled={modalLoading}
                                  onClick={async () => {
                                    setModalLoading(true);
                                    const updatedTechniques =
                                      modal.plan.techniques.map((t) =>
                                        t.uuid === tech.uuid
                                          ? { ...t, status: "dropped" }
                                          : t
                                      );
                                    await import('../../lib/api').then(({ updatePlan }) => updatePlan(modal.plan._id, updatedTechniques));
                                    setModal({
                                      open: true,
                                      plan: {
                                        ...modal.plan,
                                        techniques: updatedTechniques,
                                      },
                                    });
                                    setPlans(prevPlans => prevPlans.map(p =>
                                      p._id === modal.plan._id
                                        ? { ...p, techniques: updatedTechniques }
                                        : p
                                    ));
                                    setModalLoading(false);
                                  }}
                                >
                                  🗑 Drop
                                </button>

                                <button
                                  className="px-4 py-1 rounded-full bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-400 hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                  onClick={() =>
                                    setPopup({
                                      open: true,
                                      url: tech.url,
                                      title: tech.title,
                                    })
                                  }
                                >
                                  Details
                                </button>
                              </div>
                            </li>
                          ))
                      ) : (
                        <li className="text-gray-500 text-base">
                          No techniques
                        </li>
                      )}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Details popup for resource URL */}
        {popup.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
            <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center border border-indigo-500">
              <h2 className="text-xl font-bold mb-2">{popup.title}</h2>
              {popup.url ? (
                <>
                  <p className="mb-2 text-gray-300 break-all">Resource URL:</p>
                  <div className="mb-4 text-indigo-300 text-sm break-all">
                    {popup.url}
                  </div>
                  <div className="flex justify-center gap-4 mb-2">
                    <a
                      href={popup.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-md hover:bg-indigo-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Open Resource
                    </a>
                    <button
                      className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
                      onClick={() =>
                        setPopup({ open: false, url: "", title: "" })
                      }
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <p className="mb-4 text-gray-400">
                  No resource URL available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
