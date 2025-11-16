import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const backendUrl = useContext(AppContext)?.backendUrl || "http://localhost:5000";
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
        navigate("/login");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your registered email</p>
          <input
            type="email"
            placeholder="Email"
            className="bg-[#333A5C] text-white w-full p-2 rounded-md outline-none mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Send OTP
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={onSubmitOTP} onPaste={handlePaste} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Enter OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email</p>
          <div className="flex justify-between mb-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  type="text"
                  key={i}
                  maxLength="1"
                  required
                  ref={(el) => (inputRefs.current[i] = el)}
                  onInput={(e) => handleInput(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit OTP
          </button>
        </form>
      )}

      {isEmailSent && isOtpSubmitted && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Set New Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your new password</p>
          <input
            type="password"
            placeholder="New Password"
            className="bg-[#333A5C] text-white w-full p-2 rounded-md outline-none mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
