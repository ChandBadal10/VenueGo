










import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Convert 24hr to 12hr format
  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes || "00"} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const compareDate = new Date(dateString);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
  };

  // Fetch venue details and all related venues
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/addvenue/${id}`
        );

        if (res.data.success) {
          setVenue(res.data.venue);

          const allRes = await axios.get(
            "http://localhost:3000/api/addvenue/all"
          );

          if (allRes.data.success) {
            const normalize = (val) =>
              val?.toString().trim().toLowerCase();

            const matchingVenues = allRes.data.venues.filter(
              (v) =>
                normalize(v.venueName) ===
                  normalize(res.data.venue.venueName) &&
                normalize(v.location) ===
                  normalize(res.data.venue.location)
            );

            setAllVenues(matchingVenues);

            if (matchingVenues.length > 0) {
              const dates = [
                ...new Set(matchingVenues.map((v) => v.date)),
              ].sort();
              setSelectedDate(dates[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching venue:", err);
        toast.error("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;

      try {
        const response = await axios.get(
          "http://localhost:3000/api/bookings/slots",
          {
            params: {
              venueId: id,
              date: selectedDate,
            },
          }
        );

        if (response.data.success) {
          setBookedSlots(response.data.bookedSlots || []);
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };

    if (selectedDate) {
      fetchBookedSlots();
    }
  }, [selectedDate, id]);

  // Check if a specific slot is booked
  const isSlotBooked = (slotDate, slotStartTime, slotEndTime) => {
    return bookedSlots.some(
      (slot) =>
        slot.date === slotDate &&
        slot.startTime === slotStartTime &&
        slot.endTime === slotEndTime
    );
  };

  // Group venues by date
  const getSlotsByDate = () => {
    const grouped = {};
    allVenues.forEach((v) => {
      if (!grouped[v.date]) grouped[v.date] = [];
      grouped[v.date].push(v);
    });
    return grouped;
  };

  const calculatePrice = (slot) => {
    if (!slot) return 0;
    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);
    return (end - start) * slot.price;
  };

  const handleBookNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to book a venue");
      navigate("/login");
      return;
    }

    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    if (
      isSlotBooked(
        selectedDate,
        selectedSlot.startTime,
        selectedSlot.endTime
      )
    ) {
      toast.error("This slot is already booked");
      return;
    }

    setBookingLoading(true);

    try {
      const bookingData = {
        venueId: selectedSlot._id,
        venueName: venue.venueName,
        venueType: venue.venueType,
        price: calculatePrice(selectedSlot),
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        location: venue.location,
        description: venue.description,
      };

      const response = await axios.post(
        "http://localhost:3000/api/bookings/create",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Booking confirmed successfully!");

        const res = await axios.get(
          "http://localhost:3000/api/bookings/slots",
          {
            params: {
              venueId: id,
              date: selectedDate,
            },
          }
        );

        if (res.data.success) {
          setBookedSlots(res.data.bookedSlots || []);
        }

        setSelectedSlot(null);

        setTimeout(() => {
          navigate("/my-bookings");
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <h2 className="p-10 text-center">Loading venue...</h2>;

  if (!venue)
    return <h2 className="p-10 text-center text-red-600">Venue not found</h2>;

  const slotsByDate = getSlotsByDate();
  const availableDates = Object.keys(slotsByDate).sort();
  const currentSlots = slotsByDate[selectedDate] || [];

  return (
    /* 🔥 YOUR UI BELOW — UNCHANGED 🔥 */
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Venue Header */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <img
              src={
                venue.image ||
                "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
              }
              alt={venue.venueName}
              className="rounded-lg w-full h-[350px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {venue.venueType}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {venue.venueName}
              </h1>
              <p className="text-gray-600 flex items-center mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {venue.location}
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                {venue.description}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-3xl font-bold text-blue-600">
                {(() => {
                  if (!allVenues.length) return "Rs 0 / hour";

                  const prices = allVenues.map((v) => Number(v.price));
                  const min = Math.min(...prices);
                  const max = Math.max(...prices);

                  return min === max
                    ? `Rs ${min} / hour`
                    : `Rs ${min} - Rs ${max} / hour`;
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Booking Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Booking Slots
          </h2>

          {availableDates.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <svg
                className="w-16 h-16 mx-auto text-yellow-500 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-700 font-medium">
                No slots available for booking
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Please check back later
              </p>
            </div>
          ) : (
            <>
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Date ({availableDates.length} date
                  {availableDates.length !== 1 ? "s" : ""} available)
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedDate === date
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {formatDate(date)}
                      </div>
                      <div className="text-sm font-bold mt-1">
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs mt-1 opacity-75">
                        {slotsByDate[date]?.length || 0} slot
                        {slotsByDate[date]?.length !== 1 ? "s" : ""}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Time Slot ({currentSlots.length} slot
                  {currentSlots.length !== 1 ? "s" : ""} available)
                </label>

                {currentSlots.length === 0 ? (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                    No slots available for this date
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {currentSlots.map((slot, index) => {
                      const booked = isSlotBooked(
                        selectedDate,
                        slot.startTime,
                        slot.endTime
                      );
                      const isSelected = selectedSlot?._id === slot._id;
                      const start = parseInt(slot.startTime.split(":")[0]);
                      const end = parseInt(slot.endTime.split(":")[0]);
                      const duration = end - start;

                      return (
                        <button
                          key={index}
                          onClick={() => !booked && setSelectedSlot(slot)}
                          disabled={booked}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            booked
                              ? "bg-red-50 border-red-300 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "bg-green-50 border-green-500 shadow-md"
                              : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm"
                          }`}
                        >
                          <div
                            className={`font-semibold text-sm ${
                              booked
                                ? "text-red-700"
                                : isSelected
                                ? "text-green-700"
                                : "text-gray-800"
                            }`}
                          >
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </div>
                          <div className="text-xs mt-1 text-gray-600">
                            {duration} hour{duration > 1 ? "s" : ""}
                          </div>
                          {booked && (
                            <div className="text-xs mt-1 text-red-600 font-semibold">
                              BOOKED
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              {selectedSlot && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Date:</span>
                    <span className="text-gray-900 font-bold">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Time:</span>
                    <span className="text-gray-900 font-bold">
                      {formatTime(selectedSlot.startTime)} -{" "}
                      {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Duration:</span>
                    <span className="text-gray-900 font-bold">
                      {parseInt(selectedSlot.endTime.split(":")[0]) -
                        parseInt(selectedSlot.startTime.split(":")[0])}{" "}
                      hour(s)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Total Price:
                    </span>
                    <span className="text-green-600 font-bold text-xl">
                      Rs {calculatePrice(selectedSlot)}
                    </span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={bookingLoading || !selectedSlot}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  bookingLoading || !selectedSlot
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {bookingLoading
                  ? "Processing..."
                  : !selectedSlot
                  ? "Select a Slot to Book"
                  : "Confirm Booking"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
