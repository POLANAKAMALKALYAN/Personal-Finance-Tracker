const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb+srv://<polanakamalkalyan3_db_user>:ZtQrZ2YMeaOw8xo2@personal-finance-tracke.i1dribs.mongodb.net/?appName=Personal-Finance-Tracker');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
