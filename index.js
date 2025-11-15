const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { dataBaseConnection } = require('./config/databaseConnection');
const router = require('./route/router');
const cookieParser = require('cookie-parser');

// CORS configuration - Allow all origins
app.use(cors({
    origin: function (origin, callback) {
        // Allow all origins
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie', 'Set-Cookie']
}));

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
dataBaseConnection();

// Routes
app.use(router);

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString()
    });
});

// Handle preflight requests
app.options('*', cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Server started at port number ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS enabled for all origins`);
});

module.exports = app;
