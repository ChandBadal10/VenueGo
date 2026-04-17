import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { axios, navigate, token } = useAppContext();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const createBookingAfterPayment = async () => {
      const rawData = searchParams.get("data");

      if (!rawData) {
        setStatus("error");
        toast.error("Invalid payment response from eSewa.");
        return;
      }

      try {
        // Step 1: Decode eSewa's base64 response
        const decoded = JSON.parse(atob(rawData));
        console.log("eSewa decoded response:", decoded);

        // Step 2: Only proceed if payment is COMPLETE
        if (decoded.status !== "COMPLETE") {
          setStatus("error");
          toast.error("Payment was not completed.");
          setTimeout(() => navigate("/esewa-payment"), 2000);
          return;
        }

        // Step 3: ✅ Read from localStorage — survives eSewa's full page redirect
        const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
        console.log("orderInfo from localStorage:", orderInfo);

        if (!orderInfo) {
          setStatus("error");
          toast.error("Order info missing. Please contact support.");
          return;
        }

        // Step 4: ✅ Token fallback — AppContext may not have loaded token yet on fresh page
        const authToken = token || localStorage.getItem("token");
        if (!authToken) {
          setStatus("error");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        // Step 5: Create booking after confirmed payment
        const response = await axios.post(
          "/api/bookings/create",
          {
            venueId: orderInfo.venueId,
            venueName: orderInfo.venueName,
            venueType: orderInfo.venueType,
            price: orderInfo.totalPrice,
            date: orderInfo.date,
            startTime: orderInfo.startTime,
            endTime: orderInfo.endTime,
            location: orderInfo.location,
            description: orderInfo.description,
            transactionId: decoded.transaction_uuid,
            paymentStatus: "paid",
          },
          {
            //  Explicitly pass token in case AppContext hasn't hydrated yet
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (response.data.success) {
          localStorage.removeItem("orderInfo"); //  clean up
          setStatus("success");
          toast.success("Booking confirmed!");
        } else {
          setStatus("error");
          toast.error(response.data.message || "Booking failed. Contact support.");
        }
      } catch (error) {
        console.error("Error after payment:", error);
        // Log full error details to help debug
        console.error("Error response:", error?.response?.data);
        setStatus("error");
        toast.error(error?.response?.data?.message || "Something went wrong. Please contact support.");
      }
    };

    createBookingAfterPayment();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Confirming your booking...</p>
          <p className="text-gray-400 text-sm mt-1">Please don't close this page</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something Went Wrong</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your payment may have gone through but booking failed. Please contact support with your transaction details.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-md w-full">
        <div className="h-1.5 bg-green-500 w-full" />
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Payment Successful!</h2>
          <p className="text-sm text-gray-400 mb-6">Your venue booking has been confirmed.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full py-3 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;