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
  res.json({ plan });
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
    const plans = await Plan.find({}).limit(50).lean();
    res.json({ plans });
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
