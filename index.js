const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

dataBaseConnection();
app.use(router);
const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log("Server started at port number", port);
});
