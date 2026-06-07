const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL
exports.dataBaseConnection = () => {
    mongoose.connect(url)
        .then(() => { console.log("database connection established") })
        .catch(err => {
            console.error("unable to connect database, error -> " + err.message);
            // NOTE: Do NOT process.exit(1) on Vercel — it kills the serverless function
            // Mail feature works independently without DB
        })
}