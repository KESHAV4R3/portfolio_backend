const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL
exports.dataBaseConnection = () => {
    mongoose.connect(url)
        .then(() => { console.log("database connection established") })
        .catch(err => {
            console.log("unable to connect database, error -> " + err);
            process.exit(1);
        })
}