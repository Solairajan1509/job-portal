const { validationResult } = require("express-validator");
const createError = require("http-errors");

exports.inputValidationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map((err) => err.msg).join(", ");
        return res.status(400).json({ status: false, message: errorMsg, errors: errors.array() });
    }
    next();
};
