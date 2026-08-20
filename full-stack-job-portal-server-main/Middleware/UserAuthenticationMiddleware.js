const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.authenticateUser = async (req, res, next) => {
    let token = req.signedCookies?.[process.env.COOKIE_NAME] || req.cookies?.[process.env.COOKIE_NAME];

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(createHttpError(401, "Unauthorized User"));
    }

    try {
        const { ID, role } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findOne({ _id: ID, role }).select("-password");
        if (!req.user) {
            return next(createHttpError(401, "Unauthorized User: Account not found"));
        }
        next();
    } catch (error) {
        return next(createHttpError(401, "Unauthorized User"));
    }
};

