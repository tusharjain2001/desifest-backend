// routes/contact.js
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-contact-email", async (req, res) => {
  const { name, email, message, consent } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Required fields missing",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailHtml = `
      <h2>New Contact Us Message</h2>

      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>

      <h3>Message</h3>
      <p>${message}</p>

      <p><b>Consent to Contact:</b> ${consent ? "Yes" : "No"}</p>
    `;

    await transporter.sendMail({
      from: `"DESIFEST Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Us Submission",
      html: mailHtml,
    });

    res.status(200).json({
      success: "Contact email sent successfully",
    });
  } catch (error) {
    console.error("Contact Email Error:", error);
    res.status(500).json({
      error: "Email sending failed",
    });
  }
});

module.exports = router;
