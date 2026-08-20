const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            default: "male",
        },
        role: {
            type: String,
            enum: ["admin", "recruiter", "user"],
            default: "user",
        },
        resume: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Hashing Password asynchronously with 10 salt rounds
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
