import cron from "node-cron";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import transporter from "../configs/nodeMailer.js";

export const startReminderScheduler = () => {
  console.log("✅ Reminder scheduler started...");

  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date(); // always UTC in Node.js

    // Debug: log every tick so you can confirm the scheduler is running
    console.log(`[Reminder Scheduler] Tick at: ${now.toISOString()}`);

    try {
      // Find all confirmed bookings where:
      // 1. reminderTime is in the past (or exactly now)
      // 2. reminder has NOT been sent yet
      // 3. booking is still confirmed (not cancelled)
      const bookings = await Booking.find({
        reminderTime: { $lte: now },
        reminderSent: false,
        status: "confirmed",
      });

      console.log(
        `[Reminder Scheduler] Bookings due for reminder: ${bookings.length}`,
      );

      for (let booking of bookings) {
        try {
          const user = await User.findById(booking.userId);

          if (!user) {
            console.warn(
              `[Reminder] No user found for booking ${booking._id}, skipping.`,
            );
            // Still mark as sent so we don't keep retrying a deleted user
            booking.reminderSent = true;
            await booking.save();
            continue;
          }

          // Save in-app notification
          await Notification.create({
            user: booking.userId,
            title: "Game Starting Soon ⏰",
            message: `Your game at ${booking.venueName} starts in 1 hour at ${booking.startTime}`,
          });

          // Send email via Brevo SMTP
          await transporter.sendMail({
            from: `"VenueGo" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "⏰ Your Game Starts in 1 Hour!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f9f9f9; padding: 32px 24px; border-radius: 8px;">
                <h2 style="margin: 0 0 8px; color: #1a1a1a; font-size: 20px;">⏰ Game Reminder</h2>
                <p style="margin: 0 0 24px; color: #555; font-size: 15px;">Hi ${user.name}, your game starts in <strong style="color: #e74c3c;">1 hour</strong>. Here's a quick summary:</p>

                <div style="background: #fff; border-radius: 8px; padding: 20px 24px; border: 1px solid #e0e0e0;">
                <p style="margin: 0 0 12px; color: #333; font-size: 14px;">🏟️ <strong>Venue:</strong> ${booking.venueName}</p>
                <p style="margin: 0 0 12px; color: #333; font-size: 14px;">📅 <strong>Date:</strong> ${booking.date}</p>
                <p style="margin: 0 0 12px; color: #333; font-size: 14px;">⏰ <strong>Start Time:</strong> ${booking.startTime}</p>
                <p style="margin: 0; color: #333; font-size: 14px;">📍 <strong>Location:</strong> ${booking.location || "N/A"}</p>
                </div>

                <p style="margin: 24px 0 0; color: #27ae60; font-size: 14px; font-weight: bold;">Please arrive on time. Good luck! 🏆</p>
                <p style="margin: 8px 0 0; color: #aaa; font-size: 12px;">— VenueGo Team</p>

                </div>
                `,
                });

          // Mark reminder as sent ONLY after both notification and email succeed
          booking.reminderSent = true;
          await booking.save();

          console.log(
            `[Reminder]  Sent to ${user.email} for booking ${booking._id}`,
          );
        } catch (innerError) {
          // Don't stop the loop if one booking fails — log and continue
          console.error(
            `[Reminder]  Failed for booking ${booking._id}:`,
            innerError.message,
          );
        }
      }
    } catch (error) {
      console.error("[Reminder Scheduler] Fatal error:", error.message);
    }
  });
};
