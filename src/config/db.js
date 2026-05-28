const mongoose = require('mongoose');

let gridfsBucket;

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'sistema_provas'
  });

  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: 'uploads'
  });

  console.log('MongoDB conectado com GridFS');
  return { conn, gridfsBucket };
}

function getGridFSBucket() {
  if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
  return gridfsBucket;
}

module.exports = { connectDB, getGridFSBucket };
