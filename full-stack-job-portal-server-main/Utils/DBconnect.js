require("dotenv").config();
const mongoose = require("mongoose");

let connectPromise = null;

async function DBConnectionHandler() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectPromise && mongoose.connection.readyState === 2) {
        return connectPromise;
    }

    const isProduction = process.env.NODE_ENV === "production";
    const dbURI =
        process.env.DB_STRING ||
        "mongodb+srv://solairajansaro_db_user:solairajansaro_123@cluster0.s0ewk45.mongodb.net/job-portal?retryWrites=true&w=majority";

    connectPromise = (async () => {
        try {
            console.log("Connecting to MongoDB Atlas...");
            await mongoose.connect(dbURI, {
                serverSelectionTimeoutMS: 15000,
            });
            console.log("db connected successfully to MongoDB Atlas");
        } catch (atlasErr) {
            console.warn("Atlas connection failed, trying fallback...", atlasErr.message);
            if (!isProduction) {
                try {
                    await mongoose.connect("mongodb://127.0.0.1:27017/job-portal", {
                        serverSelectionTimeoutMS: 5000,
                    });
                    console.log("Connected to local MongoDB fallback");
                } catch (localErr) {
                    connectPromise = null;
                    throw new Error(`Database connection failed: ${atlasErr.message} (Local fallback also failed: ${localErr.message})`);
                }
            } else {
                connectPromise = null;
                throw new Error(`Atlas connection failed: ${atlasErr.message}`);
            }
        }
    })();

    return connectPromise;
}

module.exports = DBConnectionHandler;
