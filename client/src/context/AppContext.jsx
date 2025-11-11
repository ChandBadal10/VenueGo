import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


export const AppContext = createContext();

export const AppProvider = ({children}) => {

    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);




    //Function to check if user is logged in

    const fetchUser = async() => {
        try{
            const {data} = await axios.get("/api/user/data")
            if(data.success) {
                setUser(data.user)
            } else{
                navigate("/")
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    //UseEffect to retrive the token from localStorage

    useEffect(()=> {
        const token = localStorage.getItem("token")
        setToken(token)
    },[])


    //useEffect to fetch user data when token is available

    useEffect(()=> {
        if(token){
            axios.defaults.headers.common["Authorization"] = `${token}`
            fetchUser()
        }
    })


    // Function to logout the user


    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        axios.defaults.headers.common["Authorization"] = ""
        toast.success("You have been logged out")
    }




    const value = {
        navigate, axios, user, setUser, token, setToken, fetchUser, showLogin, setShowLogin, logout
    }

    return (<AppContext.Provider value={value}>
            { children }
    </AppContext.Provider>)
}


export const useAppContext = () => {
    return useContext(AppContext)
}