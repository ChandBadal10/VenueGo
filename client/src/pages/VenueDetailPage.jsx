import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const VenueDetails = () => {
  const { id } = useParams();
  const { axios, token, navigate } = useAppContext();

  const [venue, setVenue] = useState(null);
  const [allVenues, setAllVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes || "00"} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const compareDate = new Date(dateString);
    compareDate.setHours(0, 0, 0, 0);
    if (compareDate.getTime() === today.getTime()) return "Today";
    if (compareDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`/api/addvenue/${id}`);
        if (res.data.success) {
          setVenue(res.data.venue);
          const allRes = await axios.get("/api/addvenue/all");
          if (allRes.data.success) {
            const normalize = (val) => val?.toString().trim().toLowerCase();
            const matchingVenues = allRes.data.venues.filter(
              (v) =>
                normalize(v.venueName) === normalize(res.data.venue.venueName) &&
                normalize(v.location) === normalize(res.data.venue.location)
            );
            setAllVenues(matchingVenues);
            if (matchingVenues.length > 0) {
              const dates = [...new Set(matchingVenues.map((v) => v.date))].sort();
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

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || allVenues.length === 0) return;
      const slotsForDate = allVenues.filter((v) => v.date === selectedDate);
      const availabilityPromises = slotsForDate.map(async (slot) => {
        try {
          const response = await axios.get("/api/bookings/slots", {
            params: { venueId: slot._id, date: selectedDate },
          });
          return { slotId: slot._id, ...response.data };
        } catch {
          return {
            slotId: slot._id,
            capacity: slot.capacity || 1,
            bookedCount: slot.bookedCount || 0,
            availableSlots: (slot.capacity || 1) - (slot.bookedCount || 0),
            isFull: false,
          };
        }
      });
      const results = await Promise.all(availabilityPromises);
      const availabilityMap = {};
      results.forEach((r) => { availabilityMap[r.slotId] = r; });
      setSlotAvailability(availabilityMap);
    };
    fetchAvailability();
  }, [selectedDate, allVenues]);

  const isSlotFull = (slotId) => slotAvailability[slotId]?.isFull || false;
  const getAvailableSlots = (slotId) => slotAvailability[slotId]?.availableSlots || 0;
  const getCapacity = (slotId) => slotAvailability[slotId]?.capacity || 1;

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
    if (!token) { toast.error("Please login to book a venue"); navigate("/login"); return; }
    if (!selectedSlot) { toast.error("Please select a time slot"); return; }
    if (isSlotFull(selectedSlot._id)) { toast.error("This slot is fully booked"); return; }

    setBookingLoading(true);
    localStorage.setItem("orderInfo", JSON.stringify({
      venueId: selectedSlot._id,
      totalPrice: calculatePrice(selectedSlot),
      venueName: venue.venueName,
      venueType: venue.venueType,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      location: venue.location,
      description: venue.description,
    }));
    toast.success("Redirecting to payment...");
    setTimeout(() => { setBookingLoading(false); navigate("/esewa-payment"); }, 800);
  };

  if (loading) return <h2 className="p-10 text-center text-gray-800 dark:text-gray-200">Loading venue...</h2>;
  if (!venue) return <h2 className="p-10 text-center text-red-600">Venue not found</h2>;

  const slotsByDate = getSlotsByDate();
  const availableDates = Object.keys(slotsByDate).sort();
  const currentSlots = slotsByDate[selectedDate] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">

        {/* Top section — image + info */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <img
              src={venue.image || "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"}
              alt={venue.venueName}
              className="rounded-lg w-full h-[350px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {venue.venueType}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{venue.venueName}</h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center mb-4">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {venue.location}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{venue.description}</p>
              {venue.capacity > 1 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mb-4">
                  <p className="text-purple-700 dark:text-purple-300 font-medium text-sm">
                    <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Group Venue - Up to {venue.capacity} people per slot
                  </p>
                </div>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(() => {
                  if (!allVenues.length) return "Rs 0 / hour";
                  const prices = allVenues.map((v) => Number(v.price));
                  const min = Math.min(...prices);
                  const max = Math.max(...prices);
                  return min === max ? `Rs ${min} / hour` : `Rs ${min} - Rs ${max} / hour`;
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Booking Slots Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Available Booking Slots</h2>

          {availableDates.length === 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium">No slots available for booking</p>
            </div>
          ) : (
            <>
              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select Date ({availableDates.length} date{availableDates.length !== 1 ? "s" : ""} available)
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedDate === date
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                      }`}
                    >
                      <div className="text-xs font-medium">{formatDate(date)}</div>
                      <div className="text-sm font-bold mt-1">
                        {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Time Slot</label>
                {currentSlots.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    No slots available for this date
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentSlots.map((slot, index) => {
                      const isFull = isSlotFull(slot._id);
                      const availableSlots = getAvailableSlots(slot._id);
                      const capacity = getCapacity(slot._id);
                      const isSelected = selectedSlot?._id === slot._id;
                      const duration = parseInt(slot.endTime.split(":")[0]) - parseInt(slot.startTime.split(":")[0]);

                      return (
                        <button
                          key={index}
                          onClick={() => !isFull && setSelectedSlot(slot)}
                          disabled={isFull}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isFull
                              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-500 shadow-md"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-sm"
                          }`}
                        >
                          <div className={`font-semibold text-sm ${
                            isFull ? "text-red-700 dark:text-red-400"
                            : isSelected ? "text-green-700 dark:text-green-400"
                            : "text-gray-800 dark:text-white"
                          }`}>
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </div>
                          <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                            {duration} hour{duration > 1 ? "s" : ""}
                          </div>
                          {capacity > 1 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              {isFull ? (
                                <div className="text-xs font-semibold text-red-600 dark:text-red-400">FULLY BOOKED</div>
                              ) : (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 dark:text-gray-400">{availableSlots}/{capacity} spots</span>
                                  <span className={`font-semibold ${availableSlots <= 3 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                                    {availableSlots <= 3 ? "Few left" : "Available"}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          {capacity === 1 && isFull && (
                            <div className="text-xs mt-1 text-red-600 dark:text-red-400 font-semibold">BOOKED</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Slot Summary */}
              {selectedSlot && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Date:</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Time:</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                    </span>
                  </div>
                  {getCapacity(selectedSlot._id) > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Available Spots:</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {getAvailableSlots(selectedSlot._id)} / {getCapacity(selectedSlot._id)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Total Price:</span>
                    <span className="text-green-600 dark:text-green-400 font-bold text-xl">Rs {calculatePrice(selectedSlot)}</span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={bookingLoading || !selectedSlot}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  bookingLoading || !selectedSlot
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {bookingLoading ? "Processing..." : !selectedSlot ? "Select a Slot to Book" : "Confirm Booking & Pay with eSewa"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;