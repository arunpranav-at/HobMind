require('dotenv').config();
const mongoose = require('mongoose');
const Plan = require('../src/models/Plan');

async function run(){
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error('MONGO_URI not set in environment'); process.exit(1); }
  await mongoose.connect(uri);

  const demoPlans = [
    {
      hobby: 'Guitar', level: 'beginner', techniques: [
        { uuid: 'g1', title: 'Basic chords', description: 'Open chords and changes', url: 'https://www.youtube.com/watch?v=example1' },
        { uuid: 'g2', title: 'Strumming patterns', description: 'Downstroke & upstroke patterns', url: 'https://www.youtube.com/watch?v=example2' }
      ]
    },
    {
      hobby: 'Chess', level: 'beginner', techniques: [
        { uuid: 'c1', title: 'Opening principles', description: 'Control center & develop pieces', url: 'https://www.youtube.com/watch?v=example3' },
        { uuid: 'c2', title: 'Basic tactics', description: 'Forks, pins, skewers', url: 'https://www.youtube.com/watch?v=example4' }
      ]
    }
  ];

  for (const p of demoPlans){
    const exists = await Plan.findOne({ hobby: p.hobby, level: p.level });
    if (!exists) await Plan.create(p);
    else console.log('Plan exists for', p.hobby, p.level);
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
