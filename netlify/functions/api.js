const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../../backend/server');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment");
  }
  const db = await mongoose.connect(process.env.MONGO_URI);
  isConnected = db.connections[0].readyState === 1;
};

const appHandler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Netlify/AWS Lambda from freezing the connection
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Ensure we are connected before handling the request
  await connectDB();
  
  // Pass the request to the Express app
  return appHandler(event, context);
};
