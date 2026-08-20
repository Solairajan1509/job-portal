import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { getAllHandler } from "../utils/FetchHandlers";
import { API_URL } from "../utils/constants";

const jobContext = React.createContext();

const JobContext = ({ children }) => {
    const [jobLoading, setJobLoading] = useState(true);
    const [jobError, setJobError] = useState({ status: false, message: "" });
    const [jobs, setJobs] = useState({});

    const handleJobFetch = useCallback(async (url) => {
        setJobLoading(true);
        try {
            const response = await axios.get(url, { withCredentials: true });
            setJobError({ status: false, message: "" });
            setJobs(response?.data);
        } catch (error) {
            setJobError({ status: true, message: error?.message });
            setJobs({ status: false });
        } finally {
            setJobLoading(false);
        }
    }, []);

    useEffect(() => {
        handleJobFetch(`${API_URL}/jobs?page=1`);
    }, [handleJobFetch]);

    const passing = useMemo(
        () => ({
            jobLoading,
            jobError,
            jobs,
            setJobs,
            handleJobFetch,
        }),
        [jobLoading, jobError, jobs, handleJobFetch]
    );

    return (
        <jobContext.Provider value={passing}>{children}</jobContext.Provider>
    );
};

const useJobContext = () => useContext(jobContext);

export { useJobContext, JobContext };
