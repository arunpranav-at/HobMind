// aiService.js
// Azure OpenAI integration using REST API.
const axios = require('axios');

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
// Use a more recent API version by default to match newer Azure OpenAI models
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

async function generateLearningPlan({ hobby = 'Chess', level = 'beginner' } = {}){
  // Build a prompt asking the model to return strict JSON with an array of techniques
  const system = `You are an assistant that returns a concise learning plan for a hobby. Return ONLY valid JSON with a top-level object like {"hobby":"...","level":"...","techniques":[{"id":"t1","title":"...","description":"...","resources":[{"type":"video","title":"...","url":"..."}]}]}. Provide 5 to 8 techniques tailored to the level.`;
  const user = `Create a learning plan for hobby: ${hobby}. Skill level: ${level}. Keep it concise and return only JSON.`;

  if (!AZURE_ENDPOINT || !AZURE_KEY || !AZURE_DEPLOYMENT) {
    // Fallback: return a small mocked plan
    return {
      hobby,
      level,
      techniques: [
        { id: 't1', title: 'Core concept 1', description: 'Introductory concept', resources: [] },
        { id: 't2', title: 'Core concept 2', description: 'Important technique', resources: [] },
        { id: 't3', title: 'Practice routine', description: 'How to practice', resources: [] }
      ]
    };
  }

  const url = `${AZURE_ENDPOINT.replace(/\/$/, '')}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${API_VERSION}`;

  try {
    const payload = {
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 800,
      temperature: 0.7,
      n: 1
    };

    // Debug: log the URL being called and a short payload summary (no secrets)
    console.debug('[aiService] Azure URL:', url);
    console.debug('[aiService] messages:', payload.messages.map(m => ({ role: m.role, len: m.content.length })));

    const res = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_KEY
      },
      timeout: 20000
    });

    // Azure chat responses may put the text in choices[0].message.content
    let message = res?.data?.choices?.[0]?.message?.content || res?.data?.choices?.[0]?.text;
    if (!message) throw new Error('No content from Azure response');

    // Strip common markdown code fences and surrounding text markers
    message = message.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();

    // Try parsing JSON from the assistant content. It may include extra commentary; extract JSON-like substring.
    let json = null;
    try { json = JSON.parse(message); } catch (err) {
      const match = message.match(/\{[\s\S]*\}/);
      if (match) {
        try { json = JSON.parse(match[0]); } catch (e) { /* swallow */ }
      }
    }

    if (json && json.techniques && Array.isArray(json.techniques)) {
      // Ensure each technique has an id field
      json.techniques = json.techniques.map((t, i) => ({ id: t.id || t.uuid || `t-ai-${i}`, title: t.title || t.name || '', description: t.description || t.desc || '', resources: t.resources || [] }));
      return json;
    }

    // Fallback: wrap the plain text into a single technique
    return {
      hobby,
      level,
      techniques: [ { id: 't-ai-1', title: 'AI suggestion', description: message, resources: [] } ]
    };
  } catch (err) {
    // Better error diagnostics for Azure responses
    if (err && err.response) {
      console.error('Azure OpenAI call failed:', err.response.status, err.response.statusText);
      try {
        console.error('Azure response body:', JSON.stringify(err.response.data));
      } catch (e) {
        console.error('Azure response body (raw):', err.response.data);
      }
    } else {
      console.error('Azure OpenAI call failed:', err.message || err);
    }
    return {
      hobby,
      level,
      techniques: [
        { id: 't1', title: 'Core concept 1', description: 'Introductory concept (fallback)', resources: [] },
        { id: 't2', title: 'Core concept 2', description: 'Important technique (fallback)', resources: [] }
      ]
    };
  }
}

module.exports = { generateLearningPlan };
