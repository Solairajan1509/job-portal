require("dotenv").config();
const mongoose = require("mongoose");

let isConnecting = false;

async function DBConnectionHandler() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    const dbURI = process.env.DB_STRING || "mongodb://127.0.0.1:27017/job-portal";

    try {
        if (!isConnecting) {
            isConnecting = true;
            await mongoose.connect(dbURI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log("db connected successfully");
            isConnecting = false;
        }
    } catch (err) {
        isConnecting = false;
        console.log(`DB connection error: ${err.message}`);
        throw err;
    }
}

module.exports = DBConnectionHandler;
