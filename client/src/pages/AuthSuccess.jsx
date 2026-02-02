import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const AuthSuccess = () => {
  const { axios, setUser, setToken } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("token");

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        setToken(accessToken);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        try {
          const res = await axios.get(
            "http://localhost:3000/auth/me"
          );

          if (res.data.success) {
            setUser(res.data.user);
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          navigate("/");
        }
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="p-10 text-center">
      <h2>Logging in with Google...</h2>
    </div>
  );
};

export default AuthSuccess;
