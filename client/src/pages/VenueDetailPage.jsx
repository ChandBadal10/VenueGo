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

  // ─── REVIEW STATES ────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [breakdown, setBreakdown] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [canReview, setCanReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ─── EDIT STATES ──────────────────────────────────────────────────────────
  const [editingReviewId, setEditingReviewId] = useState(null); // which review is being edited
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────

  // Get logged in user id safely from token
  const getLoggedInUserId = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]))?.id;
    } catch {
      return null;
    }
  };
  const loggedInUserId = getLoggedInUserId();

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

  // ─── FETCH VENUE ──────────────────────────────────────────────────────────
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

  // ─── FETCH REVIEWS ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await axios.get(`/api/reviews/venue/${id}`);
        if (res.data.success) {
          setReviews(res.data.reviews);
          setAverageRating(res.data.averageRating);
          setTotalReviews(res.data.totalReviews);
          setBreakdown(res.data.breakdown);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // ─── CHECK IF USER CAN REVIEW ─────────────────────────────────────────────
  useEffect(() => {
    const checkCanReview = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`/api/reviews/can-review/${id}`);
        if (res.data.success) {
          setCanReview(res.data.canReview);
        }
      } catch (err) {
        console.error("Error checking review eligibility:", err);
      }
    };
    checkCanReview();
  }, [id, token]);

  // ─── FETCH SLOT AVAILABILITY ──────────────────────────────────────────────
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

  // ─── SUBMIT NEW REVIEW ────────────────────────────────────────────────────
  const handleSubmitReview = async () => {
    if (!token) { toast.error("Please login to leave a review"); navigate("/login"); return; }
    if (userRating === 0) { toast.error("Please select a star rating"); return; }
    if (comment.trim().length < 5) { toast.error("Comment must be at least 5 characters"); return; }

    setReviewLoading(true);
    try {
      const res = await axios.post("/api/reviews/create", {
        venueId: id,
        rating: userRating,
        comment: comment.trim(),
      });

      if (res.data.success) {
        toast.success("Review submitted!");
        setReviews((prev) => [res.data.review, ...prev]);
        setAverageRating(res.data.averageRating);
        setTotalReviews(res.data.totalReviews);
        setUserRating(0);
        setComment("");
      } else {
        toast.error(res.data.message || "Failed to submit review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setReviewLoading(false);
    }
  };

  // ─── START EDITING A REVIEW ───────────────────────────────────────────────
  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditHoverRating(0);
  };

  // ─── CANCEL EDITING ───────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
    setEditHoverRating(0);
  };

  // ─── SAVE EDITED REVIEW ───────────────────────────────────────────────────
  const handleSaveEdit = async (reviewId) => {
    if (editRating === 0) { toast.error("Please select a star rating"); return; }
    if (editComment.trim().length < 5) { toast.error("Comment must be at least 5 characters"); return; }

    setEditLoading(true);
    try {
      const res = await axios.put(`/api/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment.trim(),
      });

      if (res.data.success) {
        toast.success("Review updated!");
        // Replace the old review with the updated one in the list
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? res.data.review : r))
        );
        setAverageRating(res.data.averageRating);
        setTotalReviews(res.data.totalReviews);
        handleCancelEdit();
      } else {
        toast.error(res.data.message || "Failed to update review");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  // ─── DELETE REVIEW ────────────────────────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    setDeletingId(reviewId);
    try {
      const res = await axios.delete(`/api/reviews/${reviewId}`);
      if (res.data.success) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        setAverageRating(res.data.averageRating);
        setTotalReviews(res.data.totalReviews);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  // ─── STAR DISPLAY COMPONENT ───────────────────────────────────────────────
  const StarDisplay = ({ rating, size = "w-4 h-4" }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${size} ${star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  // ─── INTERACTIVE STAR PICKER ──────────────────────────────────────────────
  const StarPicker = ({ value, hover, onRate, onHover, onLeave }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={onLeave}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hover || value) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {(hover || value) > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 self-center">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hover || value]}
        </span>
      )}
    </div>
  );

  if (loading) return <h2 className="p-10 text-center text-gray-800 dark:text-gray-200">Loading venue...</h2>;
  if (!venue) return <h2 className="p-10 text-center text-red-600">Venue not found</h2>;

  const slotsByDate = getSlotsByDate();
  const availableDates = Object.keys(slotsByDate).sort();
  const currentSlots = slotsByDate[selectedDate] || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">

        {/* ─── Top section — image + info ─────────────────────────────────── */}
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

              {/* Average rating shown under venue name */}
              {totalReviews > 0 ? (
                <div className="flex items-center gap-2 mb-3">
                  <StarDisplay rating={Math.round(averageRating)} size="w-5 h-5" />
                  <span className="text-yellow-500 font-bold">{averageRating}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-3">No reviews yet</p>
              )}

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

        {/* ─── Booking Slots Section ───────────────────────────────────────── */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Available Booking Slots</h2>

          {availableDates.length === 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium">No slots available for booking</p>
            </div>
          ) : (
            <>
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

        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* ─── REVIEWS SECTION ─────────────────────────────────────────────── */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Reviews & Ratings
          </h2>

          {/* Rating Summary */}
          {totalReviews > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 mb-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="text-center flex-shrink-0">
                <div className="text-6xl font-bold text-gray-800 dark:text-white">{averageRating}</div>
                <StarDisplay rating={Math.round(averageRating)} size="w-6 h-6" />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-4">{star}</span>
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: totalReviews > 0 ? `${((breakdown[star] || 0) / totalReviews) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-4">{breakdown[star] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ Submit new review form */}
          {token && canReview && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5 mb-6">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                Leave a Review
              </h3>
              <div className="mb-4">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Your Rating</label>
                <StarPicker
                  value={userRating}
                  hover={hoverRating}
                  onRate={setUserRating}
                  onHover={setHoverRating}
                  onLeave={() => setHoverRating(0)}
                />
              </div>
              <div className="mb-4">
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Your Comment</label>
                <textarea
                  rows={3}
                  placeholder="Share your experience at this venue..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                             text-sm outline-none focus:border-blue-400 resize-none"
                />
                <div className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</div>
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={reviewLoading || userRating === 0}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  reviewLoading || userRating === 0
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}

          {/* Not logged in */}
          {!token && (
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <button onClick={() => navigate("/login")} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Log in
                </button>{" "}
                and book this venue to leave a review.
              </p>
            </div>
          )}

          {/* ─── Reviews List ─────────────────────────────────────────────── */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">Be the first to review this venue!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isOwner = review.userId?._id === loggedInUserId;
                const isEditing = editingReviewId === review._id;

                return (
                  <div
                    key={review._id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Review header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {review.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white text-sm">
                            {review.userId?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Edit + Delete buttons for review owner */}
                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleStartEdit(review)}
                            className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={deletingId === review._id}
                            className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {deletingId === review._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ✅ EDIT MODE — inline edit form */}
                    {isEditing ? (
                      <div className="mt-3 border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="mb-3">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Edit Rating</label>
                          <StarPicker
                            value={editRating}
                            hover={editHoverRating}
                            onRate={setEditRating}
                            onHover={setEditHoverRating}
                            onLeave={() => setEditHoverRating(0)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Edit Comment</label>
                          <textarea
                            rows={3}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            maxLength={500}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                       bg-white dark:bg-gray-700 text-gray-800 dark:text-white
                                       text-sm outline-none focus:border-blue-400 resize-none"
                          />
                          <div className="text-right text-xs text-gray-400 mt-1">{editComment.length}/500</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(review._id)}
                            disabled={editLoading}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                              editLoading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {editLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={editLoading}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal view mode */
                      <>
                        <StarDisplay rating={review.rating} size="w-4 h-4" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 leading-relaxed">
                          {review.comment}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* ─── END REVIEWS SECTION ─────────────────────────────────────────── */}

      </div>
    </div>
  );
};

export default VenueDetails;