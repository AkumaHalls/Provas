const mongoose = require('mongoose');

let gridfsBucket, db;

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'sistema_provas'
  });

  db = conn.connection.db;
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'uploads'
  });

  console.log('MongoDB conectado com GridFS');
  return { conn, gridfsBucket };
}

function getGridFSBucket() {
  if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
  return gridfsBucket;
}

function getDB() {
  if (!db) throw new Error('DB not initialized');
  return db;
}

module.exports = { connectDB, getGridFSBucket, getDB };
