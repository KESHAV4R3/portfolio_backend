const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL
exports.dataBaseConnection = () => {
    mongoose.connect(url)
        .then(() => { console.log("database connection established") })
        .catch(err => {
            console.log("unable to connect database, error -> " + err);
            // currently holded the process.exit due to database is not active yet
            // process.exit(1);
        })
}