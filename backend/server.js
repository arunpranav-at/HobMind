require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./src/services/dbService');
const { generateLearningPlan } = require('./src/services/aiService');
const Progress = require('./src/models/Progress');
const Plan = require('./src/models/Plan');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ status: 'HobMind backend running' }));

// Generate learning plan (uses Azure OpenAI if configured)
app.post('/api/generate-plan', async (req, res) => {
  const { hobby = 'Chess', level = 'beginner' } = req.body || {};
  const plan = await generateLearningPlan({ hobby, level });

  // Normalize techniques to include `uuid` field because Plan model expects uuid
  const techniques = (plan.techniques || []).map((t, i) => ({
    uuid: t.uuid || t.id || `t-${Date.now()}-${i}`,
    title: t.title || t.name || '',
    description: t.description || t.desc || '',
    url: t.url || (t.resources && t.resources[0] && t.resources[0].url) || ''
  }));

  // Attempt to persist the generated plan (dedupe by hobby+level)
  try {
    const exists = await Plan.findOne({ hobby, level });
    if (!exists) {
      // Validate techniques shape before creating
      const valid = Array.isArray(techniques) && techniques.length > 0 && techniques.every(t => t.uuid && t.title);
      if (valid) {
        await Plan.create({ hobby, level, techniques });
        console.log(`Persisted plan for ${hobby} (${level})`);
      } else {
        console.warn('Generated plan failed validation; not persisting to DB');
      }
    } else {
      // If exists, we won't overwrite. Logging for visibility.
      console.log(`Plan for ${hobby} (${level}) already exists in DB`);
    }
  } catch (err) {
    console.warn('Failed to persist generated plan:', err?.message || err);
  }

  // Return plan shaped to match frontend expectations (techniques with uuid)
  res.json({ plan: { hobby, level, techniques } });
});

// Progress endpoints (MongoDB-backed)
app.get('/api/progress', async (req, res) => {
  try {
    const items = await Progress.find({});
    res.json({ progress: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress', async (req, res) => {
  const { hobby, techniqueId, status } = req.body || {};
  if (!hobby || !techniqueId || !status) return res.status(400).json({ error: 'missing fields' });
  try {
    // techniqueId maps to techniqueUuid in the Progress model
    const filter = { hobby, techniqueUuid: techniqueId };
    const update = { hobby, techniqueUuid: techniqueId, status, updatedAt: new Date() };
    const doc = await Progress.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ ok: true, progress: doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List available plans
app.get('/api/plans', async (req, res) => {
  try {
    const { hobby, level } = req.query || {};
    const filter = {};
    if (hobby) filter.hobby = hobby;
    if (level) filter.level = level;
    const plans = await Plan.find(filter).limit(50).lean();
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single plan by id
app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Persist a new plan (created by AI or frontend)
app.post('/api/plans', async (req, res) => {
  const { hobby, level, techniques } = req.body || {};
  // Light validation of plan shape
  if (!hobby || !level || !Array.isArray(techniques)) return res.status(400).json({ error: 'missing fields' });
  if (!techniques.every(t => (t.uuid || t.id) && (t.title || t.name))) return res.status(400).json({ error: 'techniques must include id/uuid and title' });
  try {
    // Basic dedupe: do not create duplicate (hobby+level)
    const exists = await Plan.findOne({ hobby, level });
    if (exists) return res.status(409).json({ error: 'plan already exists', plan: exists });
    const created = await Plan.create({ hobby, level, techniques });
    res.json({ ok: true, plan: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resources endpoint (static/pre-seeded)
app.get('/api/resources', (req, res) => {
  // Return a small set of example resources; later this can call YouTube API
  res.json({ resources: [
    { id: 'r1', type: 'video', title: 'Intro tutorial', url: 'https://youtu.be/dQw4w9WgXcQ' }
  ]});
});

// Initialize DB and start server
async function start(){
  try {
    await connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connect failed:', err.message || err);
  }
  app.listen(port, () => console.log(`HobMind backend listening on ${port}`));
}

start();
