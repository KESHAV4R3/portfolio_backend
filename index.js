const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection')
const router = require('./route/router')


app.use(express.json());
dataBaseConnection();
app.use(router);
app.use(cors({
    origin: 'http://localhost:5173',
    withCredentials: true
}));

const port = process.env.PORT || 5001

app.listen(port, () => {
    console.log("server started at port number ", port)
})
