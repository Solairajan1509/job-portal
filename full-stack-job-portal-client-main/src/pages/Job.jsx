import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getSingleHandler, postHandler } from "../utils/FetchHandlers";
import { API_URL } from "../utils/constants";
import LoadingComTwo from "../components/shared/LoadingComTwo";
import { useUserContext } from "../context/UserContext";
import Swal from "sweetalert2";

import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);

import { MdAccessTime, MdLocationOn, MdWork, MdAttachMoney, MdGroup } from "react-icons/md";
import Navbar from "../components/shared/Navbar";

const Job = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [isApplying, setIsApplying] = useState(false);

    const {
        isLoading,
        isError,
        data: job,
        error,
    } = useQuery({
        queryKey: ["job", id],
        queryFn: () => getSingleHandler(`${API_URL}/jobs/${id}`),
    });

    const handleApply = async () => {
        if (!user || !user._id) {
            Swal.fire({
                icon: "info",
                title: "Login Required",
                text: "Please login to apply for this job.",
                showCancelButton: true,
                confirmButtonText: "Go to Login",
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            return;
        }

        if (user.role === "recruiter" || user.role === "admin") {
            Swal.fire({
                icon: "info",
                title: "Recruiter Account",
                text: "Only job seeker (candidate) accounts can submit applications.",
            });
            return;
        }

        // Ask or confirm resume link
        const { value: resumeUrl } = await Swal.fire({
            title: "Submit Your Application",
            text: `Applying for ${job?.position} at ${job?.company}`,
            input: "url",
            inputLabel: "Resume / Portfolio URL (Google Drive, LinkedIn, PDF, Portfolio)",
            inputValue: user?.resume || "",
            inputPlaceholder: "https://your-resume-link.com/resume.pdf",
            showCancelButton: true,
            confirmButtonText: "Submit Application",
            inputValidator: (value) => {
                if (!value) {
                    return "You must provide a valid URL for your resume!";
                }
                if (!value.startsWith("http://") && !value.startsWith("https://")) {
                    return "Resume link must start with http:// or https://";
                }
            },
        });

        if (resumeUrl) {
            setIsApplying(true);
            const currentDate = new Date().toISOString().slice(0, 10);
            const appliedJob = {
                applicantId: user._id,
                recruiterId: typeof job?.createdBy === "object" ? job?.createdBy?._id : job?.createdBy,
                jobId: job?._id || id,
                status: "pending",
                dateOfApplication: currentDate,
                resume: resumeUrl,
            };

            try {
                const response = await postHandler({
                    url: `${API_URL}/application/apply`,
                    body: appliedJob,
                });
                Swal.fire({
                    icon: "success",
                    title: "Application Sent!",
                    text: response?.data?.message || "Your application has been sent to the company recruiter.",
                });
            } catch (err) {
                const errData = err?.response?.data;
                let errMsg = "Application submission failed.";
                if (typeof errData === "string") {
                    errMsg = errData;
                } else if (errData?.message) {
                    errMsg = errData.message;
                } else if (errData?.error && Array.isArray(errData.error)) {
                    errMsg = errData.error.map((e) => e.msg || e.message).join(", ");
                } else if (err?.message) {
                    errMsg = err.message;
                }
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: errMsg,
                });
            } finally {
                setIsApplying(false);
            }
        }
    };

    const date = dayjs(job?.jobDeadline).format("MMM Do, YYYY");

    if (isLoading) {
        return <LoadingComTwo />;
    }
    if (isError) {
        return (
            <>
                <Navbar />
                <div className="text-center mt-12">
                    <h2 className="text-red-500 font-semibold text-xl">
                        {error?.message || "Job not found"}
                    </h2>
                    <Link to="/all-jobs" className="text-blue-500 underline mt-4 inline-block">
                        Back to All Jobs
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Wrapper>
                <div className="top-row">
                    <h2 className="title">
                        <span className="capitalize font-bold text-gray-800">
                            {job?.position}
                        </span>
                    </h2>
                    <h4 className="company">
                        <span className="text-blue-600 font-semibold">{job?.company}</span> • {job?.jobLocation}
                    </h4>
                    <h4 className="post-date text-gray-500 flex items-center justify-center mt-2 text-xs">
                        <MdAccessTime className="text-base mr-1" />
                        Posted on: {dayjs(job?.createdAt).format("MMM Do, YYYY")}
                    </h4>
                </div>

                <div className="middle-row">
                    <div className="description">
                        <h3 className="sec-title">Description</h3>
                        <p>{job?.jobDescription}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center text-sm text-gray-700">
                            <MdAccessTime className="mr-2 text-lg text-blue-500" />
                            <strong>Deadline:&nbsp;</strong> {date}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                            <MdGroup className="mr-2 text-lg text-blue-500" />
                            <strong>Vacancy:&nbsp;</strong> {job?.jobVacancy} Openings
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                            <MdWork className="mr-2 text-lg text-blue-500" />
                            <strong>Job Type:&nbsp;</strong> <span className="capitalize">{job?.jobType}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                            <MdAttachMoney className="mr-2 text-lg text-green-600" />
                            <strong>Salary:&nbsp;</strong> {job?.jobSalary}
                        </div>
                    </div>

                    <div className="requirement">
                        <h3 className="sec-title">Required Skills</h3>
                        <ul className="flex flex-wrap gap-2 mt-2">
                            {job?.jobSkills?.map((skill, idx) => (
                                <li key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {job?.jobFacilities && job?.jobFacilities.length > 0 && (
                        <div className="facility mt-4">
                            <h3 className="sec-title">Facilities & Benefits</h3>
                            <ul className="flex flex-wrap gap-2 mt-2">
                                {job?.jobFacilities?.map((facility, idx) => (
                                    <li key={idx} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                        {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="apply mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200 text-center">
                        <h3 className="text-lg font-bold text-gray-800">Ready to Apply?</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Your application & resume will be directly submitted to {job?.company}&apos;s recruiter.
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
                            >
                                {isApplying ? "Submitting Application..." : "Apply for this Position"}
                            </button>
                            <Link
                                to="/all-jobs"
                                className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 font-medium px-6 py-3 rounded-lg"
                            >
                                Browse Other Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section`
    padding: 2rem 0;
    max-width: 1000px;
    margin: 0 auto;
    margin-bottom: calc(20px + 1vw);
    width: 100%;

    .top-row {
        margin-bottom: calc(30px + 1vw);
    }
    .top-row .title {
        font-size: calc(14px + 1vw);
        text-align: center;
    }
    .top-row .company {
        font-size: calc(11px + 0.35vw);
        text-align: center;
        text-transform: capitalize;
        font-weight: 600;
        margin-top: 4px;
        opacity: 0.75;
    }
    .top-row .post-date {
        font-size: 11px;
        font-weight: 600;
        text-transform: capitalize;
        text-align: center;
        opacity: 0.75;
        margin-top: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .middle-row .description h3 {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .description p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .deadline {
        font-size: calc(13px + 0.1vw);
        font-weight: 600;
        opacity: 0.8;
        margin-top: calc(10px + 0.3vw);
    }
    .middle-row .vacancy {
        font-size: calc(13px + 0.1vw);
        font-weight: 600;
        opacity: 0.8;
        margin-top: 4px;
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .requirement {
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .requirement .sec-title {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .requirement p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .requirement ul {
        margin-top: 6px;
        list-style: circle;
        margin-left: calc(30px + 0.5vw);
    }
    .middle-row .requirement ul li {
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-transform: capitalize;
        padding: 2px 0;
    }

    .middle-row .facility .sec-title {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .facility {
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .facility p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-align: justify;
        line-height: 23px;
    }
    .middle-row .facility ul {
        margin-top: 6px;
        list-style: circle;
        margin-left: calc(30px + 0.5vw);
    }
    .middle-row .facility ul li {
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
        text-transform: capitalize;
        padding: 2px 0;
    }
    .middle-row .salary {
        font-size: calc(14px + 0.1vw);
        font-weight: 600;
        opacity: 0.85;
        margin-bottom: calc(10px + 0.3vw);
    }
    .middle-row .apply h3 {
        font-size: calc(14px + 0.15vw);
        font-weight: 600;
        text-transform: capitalize;
        opacity: 0.8;
        text-decoration: underline;
    }
    .middle-row .apply p {
        margin-top: 6px;
        font-size: calc(12px + 0.15vw);
        font-weight: 400;
        opacity: 0.95;
    }
    .middle-row .apply p.intro {
        text-transform: capitalize;
    }
    .middle-row .apply p.info {
        font-weight: 600;
        opacity: 0.8;
    }
`;

export default Job;
