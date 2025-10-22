"use client"
import React, { useEffect } from 'react'
import { useStore } from '../lib/store'
import { API_BASE, getAura } from '../lib/api'

export default function HydrateStore(){
  const { hobby, level, setPlan, setAuraPoints } = useStore();

  useEffect(()=>{
    // Try to fetch authoritative plan from backend; prefer server state over localStorage
    async function fetchPlan(){
      try {
        const res = await fetch(`${API_BASE}/api/plans?hobby=${encodeURIComponent(hobby)}&level=${encodeURIComponent(level)}`);
        if (!res.ok) return;
        const body = await res.json();
        if (body?.plans && body.plans.length > 0){
          const p = body.plans[0];
          // Map techniques to expected client shape
          const techniques = (p.techniques || []).map(t => ({ uuid: t.uuid || t.id, title: t.title, description: t.description, url: t.url }));
          setPlan({ hobby: p.hobby, level: p.level, techniques });
        }
      } catch (err) {
        // Ignore; localStorage fallback already exists
        console.debug('HydrateStore fetchPlan failed', err);
      }
    }
    fetchPlan();
  }, [hobby, level, setPlan]);

  // Fetch aura points once on initial client mount so UI shows correct value immediately
  useEffect(()=>{
    async function fetchAura(){
      try {
        const body = await getAura();
        if (body && typeof body.points !== 'undefined' && body.points !== null){
          setAuraPoints(body.points);
        }
      } catch (err){
        console.debug('HydrateStore fetchAura failed', err);
      }
    }
    fetchAura();
  }, [setAuraPoints]);

  return null;
}
