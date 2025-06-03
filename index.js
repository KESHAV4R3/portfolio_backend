const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');

const app = express();

const allowedOrigins = [
  'https://portfolio-frontend-lac-theta.vercel.app',
  'http://localhost:5173',
];

// CORS middleware with dynamic origin checking and credentials support
app.use(cors({
  origin: function(origin, callback) {
    console.log('Incoming request origin:', origin);
    if (!origin) return callback(null, true); // allow non-browser requests like curl, Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Connect to your database
dataBaseConnection();

// Use your routes
app.use(router);

// Error handler middleware for CORS errors and others
app.use((err, req, res, next) => {
  if (err.message && err.message.startsWith('The CORS policy')) {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server started at port number ${port}`);
});
