const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection - Serverless compatible
let isConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerlaunch-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Important for serverless
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log('MongoDB connected');
  isConnected = true;
})
.catch(err => {
  console.log('MongoDB connection error:', err.message);
  isConnected = false;
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/interviews', require('./routes/interviews'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CareerLaunch AI Backend API' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mongodb: isConnected ? 'connected' : 'disconnected' });
});

// Export the app for serverless functions
module.exports = app;
