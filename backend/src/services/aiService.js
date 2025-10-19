// aiService.js
// Azure OpenAI integration using REST API.
const axios = require('axios');

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2023-05-15';

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

    const res = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_KEY
      },
      timeout: 10000
    });

    const message = res?.data?.choices?.[0]?.message?.content;
    if (!message) throw new Error('No content from Azure response');

    // Try parsing JSON from the assistant content. It may include markdown or text; attempt to extract JSON substring.
    let json = null;
    try {
      json = JSON.parse(message);
    } catch (err) {
      // Attempt to extract the first JSON object in the string
      const match = message.match(/\{[\s\S]*\}/);
      if (match) {
        try { json = JSON.parse(match[0]); } catch (e) { /* swallow */ }
      }
    }

    if (json && json.techniques) return json;

    // Fallback: wrap the plain text into a single technique
    return {
      hobby,
      level,
      techniques: [ { id: 't-ai-1', title: 'AI suggestion', description: message, resources: [] } ]
    };
  } catch (err) {
    console.error('Azure OpenAI call failed:', err.message || err);
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
