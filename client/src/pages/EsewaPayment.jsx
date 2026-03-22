import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const EsewaPayment = () => {
  const { axios, token, navigate } = useAppContext();
  const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
  const [loading, setLoading] = useState(false);

  const handleEsewaPayment = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to make a payment.");
      navigate("/login");
      return;
    }

    if (!orderInfo) {
      toast.error("Order information not found. Please go back and select a slot.");
      return;
    }

    setLoading(true);

    try {
      const transaction_uuid = `venuego-${Date.now()}`;

      // ✅ Update orderInfo with transaction_uuid before redirect
      localStorage.setItem("orderInfo", JSON.stringify({ ...orderInfo, transaction_uuid }));

      const { data } = await axios.post("/api/payment/generate-signature", {
        total_amount: Math.round(Number(orderInfo.totalPrice)),
        transaction_uuid,
        product_code: "EPAYTEST",
      });

      if (!data.paymentUrl) {
        toast.error("Payment URL not received. Check backend .env configuration.");
        setLoading(false);
        return;
      }

      // Build and submit hidden form to eSewa
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;

      Object.entries(data.paymentData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("eSewa payment error:", error);
      toast.error(error?.response?.data?.message || "Failed to initiate payment. Try again.");
      setLoading(false);
    }
  };

  const formatTime = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour || 12}:${m || "00"} ${hour >= 12 ? "PM" : "AM"}`;
  };

  if (!orderInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No order information found.</p>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>eSewa Payment – VenueGo</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-green-500 w-full" />
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Payment Summary</h1>
              <p className="text-sm text-gray-400 mt-1">Review your booking before paying</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              {orderInfo.venueName && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Venue</span>
                  <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{orderInfo.venueName}</span>
                </div>
              )}
              {orderInfo.date && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(orderInfo.date).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {orderInfo.startTime && orderInfo.endTime && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formatTime(orderInfo.startTime)} – {formatTime(orderInfo.endTime)}
                  </span>
                </div>
              )}
              {orderInfo.location && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{orderInfo.location}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-green-600">Rs. {orderInfo.totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleEsewaPayment}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all ${
                loading ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Redirecting...
                </span>
              ) : (
                `Pay Rs. ${orderInfo.totalPrice} with eSewa`
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              Secured by eSewa payment gateway
            </p>
            <p
              onClick={() => navigate(-1)}
              className="text-center text-xs text-gray-400 mt-3 cursor-pointer hover:text-gray-600 transition-colors"
            >
              ← Change slot or go back
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EsewaPayment;