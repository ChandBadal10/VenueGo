import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BASE_URL;

    // Configure Axios for backend
    axios.defaults.baseURL = backendUrl;
    axios.defaults.withCredentials = true;

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);

    // Fetch user data if logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data");
            if (data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            toast.error(error.message);
            setUser(null);
        }
    };

    // Retrieve token from localStorage once
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    // Fetch user whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = token;
            fetchUser();
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
        }
    }, [token]);

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.success("You have been logged out");
        navigate("/"); // Use navigate instead of window.location.href
    };

    const value = {
        navigate,
        axios,
        user,
        setUser,
        token,
        setToken,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        backendUrl,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
