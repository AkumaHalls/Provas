const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');

let gfs, gridfsBucket;

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME || 'sistema_provas'
  });

  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
    bucketName: 'uploads'
  });

  gfs = Grid(conn.connection.db, mongoose.mongo);
  gfs.collection('uploads');

  console.log('MongoDB conectado com GridFS');
  return { conn, gfs, gridfsBucket };
}

function getGFS() {
  if (!gfs) throw new Error('GridFS not initialized');
  return gfs;
}

function getGridFSBucket() {
  if (!gridfsBucket) throw new Error('GridFSBucket not initialized');
  return gridfsBucket;
}

module.exports = { connectDB, getGFS, getGridFSBucket };
