import { useAppContext } from "../context/AppContext";

const PaymentFailure = () => {
  const { navigate } = useAppContext();

  const handleTryAgain = () => {
    navigate("/esewa-payment");
  };

  const handleCancel = () => {
    localStorage.removeItem("orderInfo");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-md w-full">
        <div className="h-1.5 bg-red-400 w-full" />
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Payment Cancelled</h2>
          <p className="text-sm text-gray-400 mb-6">
            No booking was created. You have not been charged.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleTryAgain}
              className="w-full py-3 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition"
            >
              Try Payment Again
            </button>
            <button
              onClick={handleCancel}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >
              Cancel & Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;