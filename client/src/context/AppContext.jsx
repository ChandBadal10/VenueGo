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
    axios.defaults.timeout = 60000; // 60s timeout for cold starts

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [backendReady, setBackendReady] = useState(false);

    // Wake up backend on app load
    useEffect(() => {
        const wakeBackend = async () => {
            try {
                await axios.get("/");
                setBackendReady(true);
            } catch {
                setBackendReady(true);
            }
        };
        wakeBackend();
    }, []);

    // Fetch user data if logged in — with retry
    const fetchUser = async (retries = 3) => {
        try {
            const { data } = await axios.get("/api/user/data");
            if (data.success) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            if (retries > 0) {
                setTimeout(() => fetchUser(retries - 1), 4000);
            } else {
                setUser(null);
            }
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
        navigate("/");
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
        backendReady,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
