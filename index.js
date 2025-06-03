const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');
const cookieParser = require('cookie-parser');

const corsOptions = {
  origin: 'https://portfolio-frontend-lac-theta.vercel.app',  // Vercel frontend URL
//   origin: 'http://localhost:5173',
  credentials: true,  // Allow cookies to be sent and received
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));



app.use(cookieParser());
app.use(express.json());

dataBaseConnection();
app.use(router);
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log("Server started at port number", port);
});
