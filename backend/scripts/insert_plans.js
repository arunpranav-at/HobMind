require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../src/models/Plan');

async function run(){
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment. Create a backend/.env or set MONGO_URI before running.');
    process.exit(1);
  }

  const dbName = process.env.MONGO_DB || 'Plans';
  console.log(`Connecting to MongoDB database: ${dbName} ...`);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName });

  const demoPlans = [
    {
      hobby: 'Guitar',
      level: 'beginner',
      techniques: [
        { uuid: 'g1', title: 'Basic open chords', description: 'Learn the basic open chords and how to switch between them smoothly.', url: 'https://www.youtube.com/watch?v=example1' },
        { uuid: 'g2', title: 'Simple strumming', description: 'Practice a few common strumming patterns with a metronome for rhythm.', url: 'https://www.youtube.com/watch?v=example2' },
        { uuid: 'g3', title: 'Chord transitions', description: 'Work on changing chords cleanly using slow practice and repetition.', url: '' }
      ]
    },
    {
      hobby: 'Chess',
      level: 'beginner',
      techniques: [
        { uuid: 'c1', title: 'Opening principles', description: 'Control the center, develop pieces, and castle early.', url: 'https://www.youtube.com/watch?v=example3' },
        { uuid: 'c2', title: 'Basic tactics', description: 'Spot forks, pins and skewers; practice simple puzzles.', url: 'https://www.youtube.com/watch?v=example4' },
        { uuid: 'c3', title: 'Endgame basics', description: 'Learn king and pawn endgames and basic checkmates.', url: '' }
      ]
    }
  ];

  for (const p of demoPlans){
    try {
      const exists = await Plan.findOne({ hobby: p.hobby, level: p.level }).lean();
      if (exists) {
        console.log(`Plan already exists for ${p.hobby} (${p.level}) — skipping`);
      } else {
        const created = await Plan.create(p);
        console.log(`Created plan ${created.hobby} (${created.level}) with ${created.techniques.length} techniques`);
      }
    } catch (err) {
      console.error('Error inserting plan', p.hobby, err.message || err);
    }
  }

  console.log('Done. Closing DB connection.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
