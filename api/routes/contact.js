const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");

const router = express.Router();

router.post("/send-contact-email", async (req, res) => {
  const { name, email, message, consent, captchaToken } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha token missing" });
  }

  try {
    // 🔐 VERIFY CAPTCHA WITH GOOGLE
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
console.log(captchaVerify.data)
    if (!captchaVerify.data.success) {
      return res.status(400).json({ error: "Captcha verification failed" });
    }

    // 📧 EMAIL TRANSPORTER
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
    
    <!-- FULL BACKGROUND -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#100422;">
      <tr>
        <td align="center">
    
          <!-- CENTERED EMAIL CARD -->
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              width:100%;
              padding:10px;
              background:#120822;
              
            "
          >
    
            <!-- HEADER / BANNER -->
            <tr>
              <td>
                <img
                  src="cid:desifestbanner"
                  alt="DESIFEST"
                  style="
                    width:100%;
                    display:block;
                    border:0;
                  "
                />
              </td>
            </tr>
    
            <!-- CONTENT -->
            <tr>
              <td style="padding:32px;color:#ffffff;">
    
                <!-- GREETING -->
                <h2 style="
                  margin:0 0 20px;
                  font-size:22px;
                  font-weight:bold;
                ">
                  Hi Admin,
                </h2>
    
                <!-- INTRO -->
                <p style="
                  margin:0 0 24px;
                  font-size:14px;
                  color:#d0d0d0;
                  line-height:1.6;
                ">
                  A new user has contacted through our website. The information they provided are:
                </p>
    
                <!-- DETAILS -->
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr>
                    <td style="padding-bottom:6px;">
                      Username: ${name}
                    </td>
                  </tr>
    
                  <tr>
                    <td style="padding-bottom:6px;">
                      Email ID: ${email}
                    </td>
                  </tr>
                </table>
    
                <!-- MESSAGE INFO -->
                <p style="
                  margin:22px 0 16px;
                  font-size:14px;
                  color:#d0d0d0;
                  line-height:1.6;
                ">
                  This username has been added to the database, but they also have a message attached as:
                </p>
    
                <!-- MESSAGE QUOTE -->
                <div style="
                  padding:18px;
                  border-radius:6px;
                  font-size:15px;
                  color:#ffffff;
                  line-height:1.6;
                  font-weight:bold;
                ">
                  “${message}”
                </div>
    
                <!-- CTA TEXT -->
                <p style="
                  margin:22px 0 18px;
                  font-size:14px;
                  color:#d0d0d0;
                ">
                  Click below to respond to their message.
                </p>
    
                <!-- BUTTON -->
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <a
                        href="mailto:${email}"
                        style="
                          display:inline-block;
                          background:#EEFE08;
                          color:#000000;
                          text-decoration:none;
                          padding:12px 28px;
                          font-weight:bold;
                          font-size:14px;
                        "
                      >
                        SHARE RESPONSE
                      </a>
                    </td>
                  </tr>
                </table>
    
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
      from: `"DESIFEST Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Contact Us Submission",
      html: mailHtml,
      attachments: [
        {
          filename: "banner.png",
          path: path.join(__dirname, "./cont.png"),
          cid: "desifestbanner",
        },
      ],
    });

    return res.status(200).json({
      success: "Contact email sent successfully",
    });

  } catch (error) {
    console.error("Contact Email Error:", error);
    return res.status(500).json({
      error: "Email sending failed",
    });
  }
});

module.exports = router;