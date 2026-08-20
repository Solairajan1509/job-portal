const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = require("./App");

// DB Connection
const DBConnectionHandler = require("./Utils/DBconnect");
DBConnectionHandler();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Job Hunter Server is running!");
});
// 404 Error handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const statusCode = err.status || err.statusCode || 500;
    const message = typeof err.message === "string" ? err.message : "Something went wrong";
    res.status(statusCode).json({ status: false, message });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
