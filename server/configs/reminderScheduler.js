import cron from "node-cron";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import transporter from "../configs/nodeMailer.js";

export const startReminderScheduler = () => {
  console.log("Reminder scheduler started...");

  cron.schedule("* * * * *", async () => {
    const now = new Date();

    try {
      const bookings = await Booking.find({
        reminderTime: { $lte: now },
        reminderSent: false,
        status: "confirmed"
      });

      for (let booking of bookings) {
        const user = await User.findById(booking.userId);
        if (!user) continue;

        // Save in-app notification
        await Notification.create({
          user: booking.userId,
          title: "Game Starting Soon",
          message: `Your game at ${booking.venueName} starts in 1 hour`
        });

        // Send email via Brevo SMTP
        await transporter.sendMail({
          from: `"VenueGo" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Game Starting Soon ⏰",
          html: `
            <h2>Hello ${user.name},</h2>
            <p>Your game at <strong>${booking.venueName}</strong> starts in 1 hour.</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.startTime}</p>
            <br/>
            <p>Please arrive on time!</p>
            <p>– VenueGo Team</p>
          `
        });

        booking.reminderSent = true;
        await booking.save();

        console.log("Reminder email sent to:", user.email);
      }

    } catch (error) {
      console.log("Reminder error:", error);
    }
  });
};