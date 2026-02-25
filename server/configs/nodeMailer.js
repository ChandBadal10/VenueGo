import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
});

// transporter.verify((error) => {
//     if (error) {
//         console.error("❌ SMTP Failed:", error.message);
//     } else {
//         console.log("✅ SMTP ready to send emails");
//     }
// });

export default transporter;