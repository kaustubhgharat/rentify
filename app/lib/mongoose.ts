import mongoose, { Mongoose } from 'mongoose';

const MONGODB_BASE_URI = process.env.MONGO_URI;
const MONGODB_DB_NAME = process.env.MONGO_DB;

if (!MONGODB_BASE_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}
if (!MONGODB_DB_NAME) {
  throw new Error('Please define the MONGO_DB environment variable inside .env.local');
}

const MONGODB_URI = `${MONGODB_BASE_URI}${MONGODB_DB_NAME}`;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

async function connectDB() {
  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;