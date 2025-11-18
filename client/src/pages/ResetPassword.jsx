import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const backendUrl = useContext(AppContext)?.backendUrl || "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);



  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };



  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    paste.split("").forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });
  };


  // Step 1: Send OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Step 2: Submit OTP
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map((input) => input.value).join("");
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  // Step 3: Submit new password
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        localStorage.removeItem("token"); // Remove old token
        navigate("/");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-white px-4">
    {!isEmailSent && (
      <form
        onSubmit={onSubmitEmail}
        className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-center mb-2 text-gray-900">
          Reset Password
        </h1>

        <p className="text-center mb-6 text-gray-500 text-sm">
          Enter your registered email
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Send OTP
        </button>
      </form>
    )}

    {isEmailSent && !isOtpSubmitted && (
      <form
        onSubmit={onSubmitOTP}
        onPaste={handlePaste}
        className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-center mb-2 text-gray-900">
          Enter OTP
        </h1>

        <p className="text-center mb-6 text-gray-500 text-sm">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[i] = el)}
                required
                onInput={(e) => handleInput(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-11 h-11 border border-gray-300 rounded-lg text-center text-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
        </div>

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Submit OTP
        </button>
      </form>
    )}

    {isEmailSent && isOtpSubmitted && (
      <form
        onSubmit={onSubmitNewPassword}
        className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold text-center mb-2 text-gray-900">
          Set New Password
        </h1>

        <p className="text-center mb-6 text-gray-500 text-sm">
          Enter your new password
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Reset Password
        </button>
      </form>
    )}
  </div>
);
};

export default ResetPassword;
