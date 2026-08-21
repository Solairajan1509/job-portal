const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.authenticateUser = async (req, res, next) => {
    let cookieToken = req.signedCookies?.[process.env.COOKIE_NAME] || req.cookies?.[process.env.COOKIE_NAME];
    if (typeof cookieToken !== "string" || !cookieToken) {
        cookieToken = null;
    }

    let headerToken = null;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        headerToken = req.headers.authorization.split(" ")[1];
    }

    const tokensToTry = [cookieToken, headerToken].filter(Boolean);

    if (tokensToTry.length === 0) {
        return next(createHttpError(401, "Unauthorized User"));
    }

    for (const token of tokensToTry) {
        try {
            const { ID, role } = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findOne({ _id: ID, role }).select("-password");
            if (user) {
                req.user = user;
                return next();
            }
        } catch (error) {
            // continue checking remaining token sources
        }
    }

    return next(createHttpError(401, "Unauthorized User"));
};

