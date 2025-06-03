const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');

const app = express();

// ✅ CORS setup - allow only your frontend
const corsOptions = {
  origin: 'https://portfolio-frontend-lac-theta.vercel.app',
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ DB connection
dataBaseConnection();

// ✅ Use router (NO full URLs here!)
app.use(router); // Or: app.use('/api', router); if you want API prefix

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server started at port number ${port}`);
});
