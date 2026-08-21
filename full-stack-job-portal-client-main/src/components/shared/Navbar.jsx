import styled from "styled-components";
import Logo from "../Logo";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import Swal from "sweetalert2";

const Navbar = ({ navbarRef }) => {
    const { user, handleFetchMe } = useUserContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
            localStorage.removeItem("token");
            await handleFetchMe();
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: "You have been logged out successfully.",
                timer: 1500,
                showConfirmButton: false,
            });
            navigate("/");
        } catch (error) {
            localStorage.removeItem("token");
            await handleFetchMe();
            navigate("/");
        }
    };

    const isLoggedIn = Boolean(user && user._id);

    return (
        <Wrapper ref={navbarRef}>
            <div className="container">
                <Logo />
                <div className="flex justify-end items-center gap-2 sm:gap-4">
                    <NavLink className="nav-item" to="/all-jobs">
                        Jobs
                    </NavLink>
                    {isLoggedIn ? (
                        <>
                            <NavLink className="nav-item" to="/dashboard">
                                Dashboard
                            </NavLink>
                            <span className="hidden md:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-800 capitalize ml-2">
                                {user?.username} ({user?.role || "user"})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 transition-colors text-white text-sm font-medium px-4 py-2 rounded ml-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink className="nav-item" to="/login">
                                <span className="bg-[#247BF7] hover:bg-blue-600 transition-colors text-white px-5 py-2 rounded">
                                    Login
                                </span>
                            </NavLink>
                            <NavLink className="nav-item hidden sm:inline-block" to="/register">
                                <span className="border border-[#247BF7] text-[#247BF7] hover:bg-blue-50 transition-colors px-4 py-2 rounded">
                                    Register
                                </span>
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    box-shadow: 0 5px 5px var(--shadow-light);
    padding: 1rem 0;
    .container {
        width: 100%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .container .nav-item {
        font-size: 16px;
        font-weight: 500;
        text-transform: capitalize;
        margin-left: 20px;
        color: var(--color-black);
    }
    .container .nav-item.active {
        color: var(--color-primary);
    }
    @media screen and (max-width: 1200px) {
        padding: 1rem 2rem;
    }
    @media screen and (max-width: 600px) {
        padding: 1.2rem 1rem;
        .container {
            display: flex;
            /* justify-content: center; */
        }
    }
`;

export default Navbar;
