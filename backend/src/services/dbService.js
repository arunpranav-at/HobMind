const mongoose = require('mongoose');

async function connect(uri){
  if (!uri) {
    console.warn('MONGO_URI not provided; skipping DB connect');
    return null;
  }
  return mongoose.connect(uri, { dbName: 'hobmind' });
}

module.exports = { connect, mongoose };
