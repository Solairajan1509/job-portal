require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env.COOKIE_SECRET || "job_portal_cookie_secret_2026"));

// Middlewares
app.use(express.json());
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, or server-to-server)
            if (!origin) return callback(null, true);
            return callback(null, true);
        },
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
    })
);

// Custom Middlewares
const {
    authenticateUser,
} = require("./Middleware/UserAuthenticationMiddleware");

// Routers
const JobRouter = require("./Router/JobRouter");
const UserRouter = require("./Router/UserRouter");
const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");

// Connecting routes
app.use(["/api/v1/Jobs", "/api/v1/jobs"], authenticateUser, JobRouter);
app.use(["/api/v1/Users", "/api/v1/users"], authenticateUser, UserRouter);
app.use(["/api/v1/Auth", "/api/v1/auth"], AuthRouter);
app.use(["/api/v1/Admin", "/api/v1/admin"], authenticateUser, AdminRouter);
app.use(["/api/v1/Application", "/api/v1/application"], authenticateUser, ApplicationRouter);

module.exports = app;
