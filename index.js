const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: ['https://portfolio-frontend-lac-theta.vercel.app', 'http://localhost:5173'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

dataBaseConnection();

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio Backend is running 🚀' });
});
app.use(router);

// Export for Vercel serverless
module.exports = app;

// Listen locally when not on Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log("Server started at port number", port);
    });
}
