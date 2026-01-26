const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-volunteer-email", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneCode,
    phone,
    address,
    city,
    province,
    postalCode,
    country,
    genre,
    howCanYouHelp,
    howCanWeHelpYou,
    consent,
  } = req.body;

  // Basic validation
  if (!firstName || !email || !genre) {
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
      <h2>New Volunteer Signup</h2>

      <h3>Basic Info</h3>
      <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phoneCode} ${phone}</p>

      <h3>Address</h3>
      <p>
        ${address || ""}, ${city || ""}<br/>
        ${province || ""} - ${postalCode || ""}<br/>
        ${country || ""}
      </p>

      <h3>Volunteering Preference</h3>
      <p><b>Genre:</b> ${genre}</p>

      <h3>How Can You Help?</h3>
      <p>${howCanYouHelp || "—"}</p>

      <h3>How Can We Help You?</h3>
      <p>${howCanWeHelpYou || "—"}</p>

      <p><b>Consent to Contact:</b> ${
        consent ? "Yes" : "No"
      }</p>
    `;

    await transporter.sendMail({
      from: `"DESIFEST Volunteer" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Volunteer Signup Submission",
      html: mailHtml,
    });

    res.status(200).json({
      success: "Volunteer email sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      error: "Email sending failed",
    });
  }
});

module.exports = router;
