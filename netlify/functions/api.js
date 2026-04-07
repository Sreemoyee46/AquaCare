const serverless = require('serverless-http');
const app = require('../../backend/server'); // Your Express app

module.exports.handler = serverless(app);
