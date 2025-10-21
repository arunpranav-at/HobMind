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

export async function fetchProgress(){
  try {
    const res = await fetch(`${API_BASE}/api/progress`)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json()
  } catch (err) {
    console.error('fetchProgress error', err)
    return { error: err.message }
  }
}

export async function updateProgress(payload){
  try {
    const res = await fetch(`${API_BASE}/api/progress`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      throw new Error(`API error ${res.status}: ${text || res.statusText}`)
    }
    return res.json()
  } catch (err) {
    console.error('updateProgress error', err)
    return { error: err.message }
  }
}

export async function savePlan(plan){
  try {
    const res = await fetch(`${API_BASE}/api/plans`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan)
    });
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      throw new Error(`API error ${res.status}: ${text || res.statusText}`)
    }
    return res.json()
  } catch (err) {
    console.error('savePlan error', err)
    throw err
  }
}
