import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";


// HELPER: recalculate and update venue average rating
const updateVenueRating = async (venueId) => {
  const reviews = await Review.find({ venueId });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        )
      : 0;

  await AddVenue.findByIdAndUpdate(venueId, {
    averageRating,
    totalReviews,
  });

  return { averageRating, totalReviews };
};


// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { venueId, rating, comment } = req.body;
    const userId = req.user._id;

    // Basic validation
    if (!venueId || !rating || !comment) {
      return res.json({
        success: false,
        message: "Venue, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check user has actually booked this venue
    const hasBooked = await Booking.findOne({
      userId,
      venueId,
      status: "confirmed",
    });

    if (!hasBooked) {
      return res.json({
        success: false,
        message: "You can only review venues you have booked",
      });
    }

    // Check user has not already reviewed this venue
    const alreadyReviewed = await Review.findOne({ userId, venueId });

    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this venue",
      });
    }

    // Get venue details
    const venue = await AddVenue.findById(venueId);
    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    // Create the review
    const review = await Review.create({
      userId,
      venueId,
      ownerId: venue.ownerId,
      rating: Number(rating),
      comment: comment.trim(),
      venueName: venue.venueName,
    });

    // Recalculate venue average rating
    const { averageRating, totalReviews } = await updateVenueRating(venueId);

    // Populate user name for immediate display
    await review.populate("userId", "name");

    return res.json({
      success: true,
      message: "Review submitted successfully",
      review,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    // Handle duplicate review error from MongoDB index
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "You have already reviewed this venue",
      });
    }
    console.error("Create review error:", error);
    return res.json({ success: false, message: error.message });
  }
};


// GET ALL REVIEWS FOR A VENUE
export const getVenueReviews = async (req, res) => {
  try {
    const { venueId } = req.params;

    const reviews = await Review.find({ venueId })
      .populate("userId", "name")   // show reviewer name
      .sort({ createdAt: -1 });     // newest first

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(1)
          )
        : 0;

    // Rating breakdown — how many 1★ 2★ 3★ 4★ 5★
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => breakdown[r.rating]++);

    return res.json({
      success: true,
      reviews,
      averageRating,
      totalReviews,
      breakdown,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


//  GET ALL REVIEWS FOR OWNER DASHBOARD

export const getOwnerReviews = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const reviews = await Review.find({ ownerId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? parseFloat(
            (
              reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(1)
          )
        : 0;

    // Group reviews by venue for owner dashboard
    const byVenue = {};
    reviews.forEach((r) => {
      const key = r.venueId.toString();
      if (!byVenue[key]) {
        byVenue[key] = {
          venueId: r.venueId,
          venueName: r.venueName,
          reviews: [],
          totalRating: 0,
        };
      }
      byVenue[key].reviews.push(r);
      byVenue[key].totalRating += r.rating;
    });

    // Calculate average per venue
    const venueStats = Object.values(byVenue).map((v) => ({
      venueId: v.venueId,
      venueName: v.venueName,
      totalReviews: v.reviews.length,
      averageRating: parseFloat(
        (v.totalRating / v.reviews.length).toFixed(1)
      ),
    }));

    return res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
      venueStats,  // per-venue breakdown for dashboard
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// DELETE REVIEW (user deletes their own review)

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    // Only the review author can delete it
    if (review.userId.toString() !== userId.toString()) {
      return res.json({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    const venueId = review.venueId;
    await Review.findByIdAndDelete(reviewId);

    // Recalculate venue rating after deletion
    const { averageRating, totalReviews } = await updateVenueRating(venueId);

    return res.json({
      success: true,
      message: "Review deleted",
      averageRating,
      totalReviews,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// CHECK IF USER CAN REVIEW (has booked + not reviewed yet)

export const checkCanReview = async (req, res) => {
  try {
    const { venueId } = req.params;
    const userId = req.user._id;

    const hasBooked = await Booking.findOne({
      userId,
      venueId,
      status: "confirmed",
    });

    const alreadyReviewed = await Review.findOne({ userId, venueId });

    return res.json({
      success: true,
      canReview: !!hasBooked && !alreadyReviewed,
      hasBooked: !!hasBooked,
      alreadyReviewed: !!alreadyReviewed,
      existingReview: alreadyReviewed || null,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};