// Update an existing plan's techniques/status
export async function updatePlan(planId, techniques) {
  try {
    const res = await fetch(`${API_BASE}/api/plans/${planId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ techniques })
    });
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      throw new Error(`API error ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
  } catch (err) {
    console.error('updatePlan error', err);
    throw err;
  }
}
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export async function getAura(){
  try {
    const res = await fetch(`${API_BASE}/api/aura`);
    if (!res.ok) {
      let body = null;
      try { body = await res.text(); } catch(e){}
      console.error('getAura non-ok response', { status: res.status, statusText: res.statusText, body });
      throw new Error(`Failed to fetch aura: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) { console.error('getAura', err); return { points: 0 } }
}

export async function adjustAura(delta){
  try {
    const res = await fetch(`${API_BASE}/api/aura/adjust`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ delta }) });
    if (!res.ok) throw new Error('Failed to adjust aura');
    return res.json();
  } catch (err) { console.error('adjustAura', err); return { points: null } }
}

export async function generatePlan(hobby, level){
  try {
    const res = await fetch(`${API_BASE}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby, level })
    })
    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      throw {
        status: res.status,
        message: `API error ${res.status}: ${res.statusText}`,
        data
      };
    }
    return res.json();
  } catch (err) {
    // Only log non-409 errors for debugging; suppress duplicate plan errors
    if (err && typeof err === 'object' && 'status' in err) {
      if (err.status !== 409) {
        console.error('generatePlan error:', {
          status: err.status,
          message: err.message,
          data: err.data
        });
      }
    } else {
      console.error('generatePlan error', err);
    }
    throw err;
  }
}


export async function savePlan(plan){
  try {
    const res = await fetch(`${API_BASE}/api/plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan)
    });
    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      throw {
        status: res.status,
        message: `API error ${res.status}: ${res.statusText}`,
        data
      };
    }
    return res.json();
  } catch (err) {
    // Only log non-409 errors
    if (!(err.message && err.message.includes('409'))) {
      console.error('savePlan error', err)
    }
    throw err
  }
}
