import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import DashboardLayout from "../Layout/DashboardLayout";
import Loading from "../components/shared/Loading";

// Lazy-loaded Page Components for Bundle Optimization
const Landing = lazy(() => import("../pages/Landing"));
const AllJobs = lazy(() => import("../pages/AllJobs"));
const Job = lazy(() => import("../pages/Job"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const Stats = lazy(() => import("../pages/Stats"));
const AddJob = lazy(() => import("../pages/AddJob"));
const ManageJobs = lazy(() => import("../pages/ManageJobs"));
const ManageUsers = lazy(() => import("../pages/ManageUsers"));
const Admin = lazy(() => import("../pages/Admin"));
const EditJob = lazy(() => import("../pages/EditJob"));
const MyJobs = lazy(() => import("../pages/MyJobs"));
const Error = lazy(() => import("../pages/Error"));

import { JobContext } from "../context/JobContext";
import CommonProtectRoute from "../components/shared/CommonProtectRoute";
import ProtectAdminRoute from "../components/shared/ProtectAdminRoute";
import RecruiterRoute from "../components/shared/RecruiterRoute";

const withSuspense = (Component) => (
    <Suspense fallback={<Loading />}>
        {Component}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: withSuspense(<Error />),
        children: [
            {
                index: true,
                element: withSuspense(<Landing />),
            },
            {
                path: "all-jobs",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            {withSuspense(<AllJobs />)}
                        </JobContext>
                    </CommonProtectRoute>
                ),
            },
            {
                path: "job/:id",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            {withSuspense(<Job />)}
                        </JobContext>
                    </CommonProtectRoute>
                ),
            },
            {
                path: "register",
                element: withSuspense(<Register />),
            },
            {
                path: "login",
                element: withSuspense(<Login />),
            },
            {
                path: "dashboard",
                element: (
                    <CommonProtectRoute>
                        <JobContext>
                            <DashboardLayout />
                        </JobContext>
                    </CommonProtectRoute>
                ),
                children: [
                    {
                        index: true,
                        element: withSuspense(<Profile />),
                    },
                    {
                        path: "edit-profile/:id",
                        element: withSuspense(<EditProfile />),
                    },
                    {
                        path: "stats",
                        element: (
                            <ProtectAdminRoute>
                                {withSuspense(<Stats />)}
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "add-jobs",
                        element: (
                            <RecruiterRoute>
                                {withSuspense(<AddJob />)}
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-jobs",
                        element: (
                            <RecruiterRoute>
                                {withSuspense(<ManageJobs />)}
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "manage-users",
                        element: (
                            <ProtectAdminRoute>
                                {withSuspense(<ManageUsers />)}
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "admin",
                        element: (
                            <ProtectAdminRoute>
                                {withSuspense(<Admin />)}
                            </ProtectAdminRoute>
                        ),
                    },
                    {
                        path: "edit-job/:id",
                        element: (
                            <RecruiterRoute>
                                {withSuspense(<EditJob />)}
                            </RecruiterRoute>
                        ),
                    },
                    {
                        path: "my-jobs",
                        element: (
                            <CommonProtectRoute>
                                {withSuspense(<MyJobs />)}
                            </CommonProtectRoute>
                        ),
                    },
                ],
            },
        ],
    },
]);

export default router;
