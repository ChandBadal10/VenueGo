import React, { useState } from 'react';


const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Otp sent to your email:", email);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 sm:w-[352px]"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">
          Reset Password
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email address to receive a otp.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border border-gray-300 rounded w-full p-2 mb-4 outline-blue-600"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
