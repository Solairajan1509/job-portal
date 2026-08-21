require("dotenv").config();
const mongoose = require("mongoose");

let isConnecting = false;

async function DBConnectionHandler() {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.DB_STRING) {
        const msg = "Warning: DB_STRING is not defined in environment.";
        console.log(msg);
        throw new Error(msg);
    }

    try {
        if (!isConnecting) {
            isConnecting = true;
            await mongoose.connect(process.env.DB_STRING, {
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
