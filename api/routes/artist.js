const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const router = express.Router();
const axios = require("axios");
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
    captchaToken
  } = req.body;

  if (!firstName || !email || !event) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha token missing" });
  }

  try {

    // 🔐 VERIFY CAPTCHA
    const captchaVerify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: captchaToken,
        },
      }
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }
console.log(captchaVerify.data)
    // 📧 EMAIL TRANSPORT
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    
    <body style="
      margin:0;
      padding:0;
      background:#100422;
      font-family:Arial, Helvetica, sans-serif;
    ">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#100422;">
      <tr>
        <td align="center">
    
          <table width="100%" cellpadding="0" cellspacing="0" style="
            width:100%;
            padding:10px;
            background:#120822;
          ">
    
            <!-- HEADER IMAGE -->
            <tr>
              <td>
                <img
                  src="cid:desifestbanner"
                  alt="DESIFEST Artist Signup"
                  style="width:100%; display:block; border:0;"
                />
              </td>
            </tr>
    
            <!-- CONTENT -->
            <tr>
              <td style="padding:32px;color:#ffffff;">
    
                <h2 style="margin:0 0 20px;font-size:22px;font-weight:bold;">
                  Hi Admin,
                </h2>
    
                <p style="
                  margin:0 0 24px;
                  font-size:14px;
                  color:#d0d0d0;
                  line-height:1.6;
                ">
                  A new artist has registered for <b>${event}</b>.  
                  Below are the submitted details:
                </p>
    
                <!-- ARTIST INFO -->
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr><td style="padding-bottom:6px;"><b>Name:</b> ${firstName} ${lastName || ""}</td></tr>
                  <tr><td style="padding-bottom:6px;"><b>Email:</b> ${email}</td></tr>
                  <tr><td style="padding-bottom:6px;"><b>Phone:</b> ${phoneCode || ""} ${phone || ""}</td></tr>
                </table>
    
                <!-- ADDRESS -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Address</b>
                </p>
                <p style="font-size:14px;line-height:1.6;">
                  ${address || ""}<br/>
                  ${city || ""}, ${province || ""} ${postalCode || ""}<br/>
                  ${country || ""}
                </p>
    
                <!-- GENRE -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Genre</b>
                </p>
                <div style="padding:14px;background:#1b0c33;border-radius:6px;">
                  ${genre === "OTHER" ? otherGenre : genre}
                </div>
    
                <!-- SOCIAL LINKS -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Social Media</b>
                </p>
                <ul style="font-size:14px;line-height:1.8;">
                  <li>Facebook: ${facebook || "-"}</li>
                  <li>YouTube: ${youtube || "-"}</li>
                  <li>Instagram: ${instagram || "-"}</li>
                  <li>TikTok: ${tiktok || "-"}</li>
                  <li>Spotify: ${spotify || "-"}</li>
                  <li>Website: ${website || "-"}</li>
                </ul>
    
                <!-- PERFORMANCE -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Performance Details</b>
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr><td>Language: ${performanceLanguage || "-"}</td></tr>
                  <tr><td>Band: ${isBand}</td></tr>
                  <tr><td>Performed Before: ${performedBefore}</td></tr>
                  <tr><td>Performance Type: ${performanceType}</td></tr>
                  <tr><td>SOCAN / BMI: ${socanRegistered}</td></tr>
                </table>
    
                <!-- MANAGER -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Manager Details</b>
                </p>
                <p style="font-size:14px;">
                  ${managerFirstName || ""} ${managerLastName || ""}<br/>
                  ${managerEmail || "-"}<br/>
                  ${managerPhoneCode || ""} ${managerPhone || ""}
                </p>
    
                <!-- PAST LINKS -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Past Performance Links</b>
                </p>
                <ul style="font-size:14px;">
                  ${(pastLinks || []).map(l => `<li>${l}</li>`).join("") || "<li>-</li>"}
                </ul>
    
                <!-- IDEAS -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Artist Ideas</b>
                </p>
                <div style="padding:14px;background:#1b0c33;border-radius:6px;">
                  ${ideas || "-"}
                </div>
    
                <!-- CTA -->
                <p style="margin:22px 0 18px;font-size:14px;color:#d0d0d0;">
                  Please review and take action.
                </p>
    
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;">
                      <a href="#"
                        style="
                          display:inline-block;
                          background:#EEFE08;
                          color:#000;
                          text-decoration:none;
                          padding:12px 28px;
                          font-weight:bold;
                          font-size:14px;
                        ">
                        ACCEPT
                      </a>
                    </td>
                    <td>
                      <a href="#"
                        style="
                          display:inline-block;
                          border:2px solid #EEFE08;
                          color:#EEFE08;
                          text-decoration:none;
                          padding:12px 28px;
                          font-weight:bold;
                          font-size:14px;
                        ">
                        REJECT
                      </a>
                    </td>
                  </tr>
                </table>
    
                <p style="margin-top:22px;font-size:13px;color:#999;">
                  Consent to contact: ${consent ? "Yes" : "No"}
                </p>
    
              </td>
            </tr>
          </table>
    
        </td>
      </tr>
    </table>
    
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"DESIFEST Artist Signup" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Artist Signup Submission",
      html,
      attachments: [
        {
          filename: "artist-banner.png",
          path: path.join(__dirname, "./cont.png"),
          cid: "desifestbanner",
        },
      ],
    });

    res.status(200).json({
      success: "Artist signup email sent successfull",
    });

  } catch (err) {
    console.error("Artist Email Error:", err);
    res.status(500).json({
      error: "Failed to send artist email",
    });
  }
});

module.exports = router;
