require("dotenv").config();
const mongoose = require("mongoose");

async function DBConnectionHandler() {
    try {
        if (!process.env.DB_STRING) {
            console.log("Warning: DB_STRING is not defined in environment.");
            return;
        }
        await mongoose.connect(process.env.DB_STRING);
        console.log("db connected successfully");
    } catch (err) {
        console.log(`DB connection notice: ${err.message}`);
    }
}

module.exports = DBConnectionHandler;
