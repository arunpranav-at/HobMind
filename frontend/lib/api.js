export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000'

export async function generatePlan(hobby, level){
  const res = await fetch(`${API_BASE}/api/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hobby, level })
  })
  return res.json()
}

export async function fetchProgress(){
  const res = await fetch(`${API_BASE}/api/progress`)
  return res.json()
}

export async function updateProgress(payload){
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  })
  return res.json()
}
