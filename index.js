const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');
const cookieParser = require('cookie-parser');

const allowedOrigins = ['https://portfolio-frontend-lac-theta.vercel.app', 'http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

dataBaseConnection();
app.use(router);
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log("Server started at port number", port);
});
