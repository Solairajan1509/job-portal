const mongoose = require("mongoose");
const { JOB_STATUS, JOB_TYPE } = require("../Utils/JobConstants");

const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "A Company name is required"],
            trim: true,
            minLength: [2, "Company name is too short"],
            maxLength: [100, "Company name is too long"],
        },
        position: {
            type: String,
            required: [true, "Job must have a Position"],
            trim: true,
            minLength: [2, "Position name is too short"],
            maxLength: [200, "Position name is too long"],
        },
        jobStatus: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
            index: true,
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME,
            index: true,
        },
        jobLocation: {
            type: String,
            required: [true, "Job must have a location"],
            index: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            index: true,
        },
        jobVacancy: {
            type: String,
            required: [true, "Job Vacancy is required"],
            trim: true,
        },
        jobSalary: {
            type: String,
            required: [true, "Job Salary is required"],
            trim: true,
        },
        jobDeadline: {
            type: String,
            required: [true, "Job Deadline is required"],
            trim: true,
        },
        jobDescription: {
            type: String,
            required: [true, "Job Description is required"],
            trim: true,
        },
        jobSkills: {
            type: [],
            required: [true, "Job Skills is required"],
        },
        jobFacilities: {
            type: [],
            required: [true, "Job facilities is required"],
        },
        jobContact: {
            type: String,
            required: [true, "Job contact is required"],
            trim: true,
        },
    },
    { timestamps: true }
);

// Indexes for high-performance queries and filtering
JobSchema.index({ createdAt: -1 });
JobSchema.index({ company: 1, position: 1 });

const JobModel = mongoose.model("Job", JobSchema);
module.exports = JobModel;
