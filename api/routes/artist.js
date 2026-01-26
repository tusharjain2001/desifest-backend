const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/send-artist-email", async (req, res) => {
  const {
    event,
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

    facebook,
    youtube,
    instagram,
    tiktok,
    spotify,
    website,

    genre,
    otherGenre,

    performanceLanguage,
    isBand,
    performedBefore,
    performanceType,
    socanRegistered,

    managerFirstName,
    managerLastName,
    managerEmail,
    managerPhoneCode,
    managerPhone,

    pastLinks,
    ideas,
    consent,
  } = req.body;

  // 🔴 minimal required validation
  if (!firstName || !email || !event) {
    return res.status(400).json({ error: "Missing required fields" });
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

    const html = `
      <h2>New Artist Signup</h2>

      <h3>Event</h3>
      <p>${event}</p>

      <h3>Artist Info</h3>
      <p><b>Name:</b> ${firstName} ${lastName || ""}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phoneCode || ""} ${phone || ""}</p>

      <h3>Address</h3>
      <p>
        ${address || ""}<br/>
        ${city || ""}, ${province || ""} ${postalCode || ""}<br/>
        ${country || ""}
      </p>

      <h3>Genre</h3>
      <p>${genre === "OTHER" ? otherGenre : genre}</p>

      <h3>Social Media</h3>
      <ul>
        <li>Facebook: ${facebook || "-"}</li>
        <li>YouTube: ${youtube || "-"}</li>
        <li>Instagram: ${instagram || "-"}</li>
        <li>TikTok: ${tiktok || "-"}</li>
        <li>Spotify: ${spotify || "-"}</li>
        <li>Website: ${website || "-"}</li>
      </ul>

      <h3>Performance Details</h3>
      <p><b>Language:</b> ${performanceLanguage || "-"}</p>
      <p><b>Band:</b> ${isBand}</p>
      <p><b>Performed at DESIFEST before:</b> ${performedBefore}</p>
      <p><b>Performance Type:</b> ${performanceType}</p>
      <p><b>SOCAN / BMI:</b> ${socanRegistered}</p>

      <h3>Manager Details</h3>
      <p><b>Name:</b> ${managerFirstName || ""} ${
      managerLastName || ""
    }</p>
      <p><b>Email:</b> ${managerEmail || "-"}</p>
      <p><b>Phone:</b> ${managerPhoneCode || ""} ${
      managerPhone || ""
    }</p>

      <h3>Past Performance Links</h3>
      <ul>
        ${(pastLinks || [])
          .map((link) => `<li>${link}</li>`)
          .join("")}
      </ul>

      <h3>Artist Ideas</h3>
      <p>${ideas || "-"}</p>

      <p><b>Consent:</b> ${consent ? "Yes" : "No"}</p>
    `;

    await transporter.sendMail({
      from: `"DESIFEST Artist Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Artist Signup Submission",
      html,
    });

    res.status(200).json({
      success: "Artist signup email sent successfully",
    });
  } catch (err) {
    console.error("Artist Email Error:", err);
    res.status(500).json({
      error: "Failed to send artist email",
    });
  }
});

module.exports = router;
