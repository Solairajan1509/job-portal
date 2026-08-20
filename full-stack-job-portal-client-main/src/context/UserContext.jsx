import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";

const userContext = React.createContext();

const UserContext = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState({ status: false, message: "" });
    const [user, setUser] = useState({});

    const handleFetchMe = useCallback(async () => {
        setUserLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/auth/me`,
                { withCredentials: true }
            );
            setUserError({ status: false, message: "" });
            setUser(response?.data?.result);
        } catch (error) {
            setUserError({ status: true, message: error?.message });
            setUser({ status: false });
        }
        setUserLoading(false);
    }, []);

    useEffect(() => {
        handleFetchMe();
    }, [handleFetchMe]);

    const passing = useMemo(
        () => ({ userLoading, userError, user, handleFetchMe }),
        [userLoading, userError, user, handleFetchMe]
    );

    return (
        <userContext.Provider value={passing}>{children}</userContext.Provider>
    );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };
