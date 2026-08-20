const mongoose = require("mongoose");
const { STATUS } = require("../Utils/ApplicationConstants");

const ApplicationSchema = new mongoose.Schema(
    {
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(STATUS),
            default: STATUS.PENDING,
            required: true,
            index: true,
        },
        resume: {
            type: String,
            required: true,
        },
        dateOfApplication: {
            type: Date,
            default: Date.now,
        },
        dateOfJoining: {
            type: Date,
            validate: [
                {
                    validator: function (value) {
                        return this.dateOfApplication <= value;
                    },
                    message:
                        "dateOfJoining should be greater than dateOfApplication",
                },
            ],
        },
    },
    { timestamps: true }
);

// Prevent duplicate applications for the same job by the same candidate
ApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });

const ApplicationModel = mongoose.model("application", ApplicationSchema);
module.exports = ApplicationModel;
