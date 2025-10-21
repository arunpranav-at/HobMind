export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export async function generatePlan(hobby, level){
  try {
    const res = await fetch(`${API_BASE}/api/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hobby, level })
    })
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      throw new Error(`API error ${res.status}: ${text || res.statusText}`)
    }
    return res.json()
  } catch (err) {
    console.error('generatePlan error', err)
    throw err
  }
}


export async function savePlan(plan){
  try {
    const res = await fetch(`${API_BASE}/api/plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan)
    });
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      // If duplicate (409), return a special value instead of throwing
      if (res.status === 409) {
        return { duplicate: true, error: text };
      }
      throw new Error(`API error ${res.status}: ${text || res.statusText}`)
    }
    return res.json()
  } catch (err) {
    // Only log non-409 errors
    if (!(err.message && err.message.includes('409'))) {
      console.error('savePlan error', err)
    }
    throw err
  }
}
