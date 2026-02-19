import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const compareDate = new Date(dateString);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) return "Today";
    if (compareDate.getTime() === tomorrow.getTime()) return "Tomorrow";
    return new Date(dateString).toLocaleDateString("en-US", { weekday: "short" });
  };

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/trainers/${id}`);
        if (res.data.success) {
          setTrainer(res.data.trainer);
          const slots = res.data.trainer.slots || [];
          if (slots.length > 0) {
            const dates = [...new Set(slots.map((s) => s.date))].sort();
            setSelectedDate(dates[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching trainer:", err);
        toast.error("Failed to load trainer details");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainer();
  }, [id]);

  // ------------------ Group slots by trainer identity ------------------
  const getGroupedSlots = () => {
    if (!trainer) return [];
    const grouped = {};
    (trainer.slots || []).forEach((slot) => {
      const key = `${trainer.name}-${trainer.email}`;
      if (!grouped[key]) {
        grouped[key] = {
          trainerInfo: {
            name: trainer.name,
            specialization: trainer.specialization,
            venueName: trainer.venueName,
            phone: trainer.phone,
            email: trainer.email,
            image: trainer.image,
            bio: trainer.bio,
            experience: trainer.experience,
          },
          slots: [],
        };
      }
      grouped[key].slots.push(slot);
    });
    return Object.values(grouped);
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
      toast.error("Please login to book a session");
      navigate("/login");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (selectedSlot.isBooked) {
      toast.error("This slot is already booked");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        trainerId: trainer._id,
        trainerName: trainer.name,
        specialization: trainer.specialization,
        venueName: trainer.venueName,
        price: calculatePrice(selectedSlot),
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      };

      const response = await axios.post(
        "http://localhost:3000/api/trainer-bookings/create",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Session booked successfully!");
        setSelectedSlot(null);
        setTimeout(() => navigate("/my-bookings"), 1500);
      } else {
        toast.error(response.data.message || "Failed to book session");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Failed to book session");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <h2 className="p-10 text-center">Loading trainer...</h2>;
  if (!trainer) return <h2 className="p-10 text-center text-red-600">Trainer not found</h2>;

  const groupedSlots = getGroupedSlots();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {groupedSlots.map((group, idx) => {
          const dates = [...new Set(group.slots.map((s) => s.date))].sort();
          return (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Trainer top info */}
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div>
                  {group.trainerInfo.image ? (
                    <img
                      src={group.trainerInfo.image}
                      alt={group.trainerInfo.name}
                      className="rounded-lg w-full h-[350px] object-cover"
                      onError={(e) => {
                        e.target.parentElement.innerHTML = `<div class="rounded-lg w-full h-[350px] bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-8xl">💪</div>`;
                      }}
                    />
                  ) : (
                    <div className="rounded-lg w-full h-[350px] bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-8xl">
                      💪
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {group.trainerInfo.specialization}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{group.trainerInfo.name}</h1>
                    <p className="text-gray-600 flex items-center mb-3">{group.trainerInfo.venueName}</p>
                    <p className="text-gray-600 flex items-center mb-3">{group.trainerInfo.experience} years experience</p>
                    <p className="text-gray-600 flex items-center mb-3">{group.trainerInfo.phone}</p>
                    <p className="text-gray-600 flex items-center mb-4">{group.trainerInfo.email}</p>
                    {group.trainerInfo.bio && (
                      <p className="text-gray-700 leading-relaxed mb-6">{group.trainerInfo.bio}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">
                      {(() => {
                        const prices = group.slots.map((s) => Number(s.price));
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        return min === max ? `Rs ${min} / hour` : `Rs ${min} - Rs ${max} / hour`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Booking Slots */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Session Slots</h2>

                {dates.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 font-medium">No slots available for booking</p>
                  </div>
                ) : (
                  <>
                    {/* Dates */}
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                      {dates.map((date) => (
                        <button
                          key={date}
                          onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                          className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${
                            selectedDate === date
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          <div className="text-xs font-medium">{formatDate(date)}</div>
                          <div className="text-sm font-bold mt-1">
                            {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Time Slots */}
                    <div className="mb-6">
                      {group.slots.filter((s) => s.date === selectedDate).length === 0 ? (
                        <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">No slots available for this date</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {group.slots.filter((s) => s.date === selectedDate).map((slot) => {
                            const isFull = slot.isBooked;
                            const isSelected = selectedSlot?._id === slot._id;
                            const start = parseInt(slot.startTime.split(":")[0]);
                            const end = parseInt(slot.endTime.split(":")[0]);
                            const duration = end - start;

                            return (
                              <button
                                key={slot._id}
                                onClick={() => !isFull && setSelectedSlot(slot)}
                                disabled={isFull}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                  isFull
                                    ? "bg-red-50 border-red-300 cursor-not-allowed opacity-60"
                                    : isSelected
                                    ? "bg-green-50 border-green-500 shadow-md"
                                    : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm"
                                }`}
                              >
                                <div className={`font-semibold text-sm ${isFull ? "text-red-700" : isSelected ? "text-green-700" : "text-gray-800"}`}>
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                                <div className="text-xs mt-1 text-gray-600">{duration} hour{duration > 1 ? "s" : ""}</div>
                                <div className="text-xs mt-1 font-medium text-blue-600">Rs {slot.price} / hr</div>
                                {isFull && <div className="text-xs mt-1 text-red-600 font-semibold">BOOKED</div>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Booking summary */}
                    {selectedSlot && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">Trainer:</span>
                          <span className="text-gray-900 font-bold">{group.trainerInfo.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">Venue:</span>
                          <span className="text-gray-900 font-bold">{group.trainerInfo.venueName}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">Date:</span>
                          <span className="text-gray-900 font-bold">
                            {new Date(selectedDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">Time:</span>
                          <span className="text-gray-900 font-bold">
                            {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Total Price:</span>
                          <span className="text-green-600 font-bold text-xl">Rs {calculatePrice(selectedSlot)}</span>
                        </div>
                      </div>
                    )}

                    {/* Book button */}
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
          );
        })}
      </div>
    </div>
  );
};

export default TrainerDetails;
