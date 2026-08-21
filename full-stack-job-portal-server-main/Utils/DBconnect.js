require("dotenv").config();
const mongoose = require("mongoose");

let isConnecting = false;

async function DBConnectionHandler() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    const isProduction = process.env.NODE_ENV === "production";
    const dbURI = process.env.DB_STRING;

    if (!dbURI) {
        if (isProduction) {
            const errMsg =
                "FATAL: DB_STRING environment variable is not set. " +
                "Please add your MongoDB Atlas connection string to the Render dashboard " +
                "under Environment Variables for the job-portal-backend-api service.";
            console.error(errMsg);
            throw new Error(errMsg);
        } else {
            // Local development fallback
            console.warn("DB_STRING not set, using local MongoDB fallback.");
        }
    }

    const connectionURI = dbURI || "mongodb://127.0.0.1:27017/job-portal";

    try {
        if (!isConnecting) {
            isConnecting = true;
            await mongoose.connect(connectionURI, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log("db connected successfully");
            isConnecting = false;
        }
    } catch (err) {
        isConnecting = false;
        console.error(`DB connection error: ${err.message}`);
        throw err;
    }
}

module.exports = DBConnectionHandler;
