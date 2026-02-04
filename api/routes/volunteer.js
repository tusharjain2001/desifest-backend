const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
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
                  alt="DESIFEST Volunteer Signup"
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
                  A new user has registered from our website as a <b>volunteer</b>.
                  The information they provided are:
                </p>
    
                <!-- BASIC INFO -->
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr><td style="padding-bottom:6px;"><b>Name:</b> ${firstName} ${lastName || ""}</td></tr>
                  <tr><td style="padding-bottom:6px;"><b>Email:</b> ${email}</td></tr>
                  <tr><td style="padding-bottom:6px;"><b>Phone:</b> ${phoneCode} ${phone}</td></tr>
                  <tr><td style="padding-bottom:6px;"><b>Genre:</b> ${genre}</td></tr>
                </table>
    
                <!-- ADDRESS -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>Address</b>
                </p>
                <p style="font-size:14px;line-height:1.6;">
                  ${address || ""}, ${city || ""}<br/>
                  ${province || ""} ${postalCode || ""}<br/>
                  ${country || ""}
                </p>
    
                <!-- HOW CAN YOU HELP -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>How can you help?</b>
                </p>
                <div style="
                  padding:16px;
                  border-radius:6px;
                  font-size:14px;
                  line-height:1.6;
                  
                ">
                  ${howCanYouHelp || "—"}
                </div>
    
                <!-- HOW CAN WE HELP -->
                <p style="margin:22px 0 10px;font-size:14px;color:#d0d0d0;">
                  <b>How can we help you?</b>
                </p>
                <div style="
                  padding:16px;
                  border-radius:6px;
                  font-size:14px;
                  line-height:1.6;
                  
                ">
                  ${howCanWeHelpYou || "—"}
                </div>
    
                <!-- CTA -->
                <p style="margin:22px 0 18px;font-size:14px;color:#d0d0d0;">
                  Click below to approve or reject this volunteer request.
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
      from: `"DESIFEST Volunteer" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "New Volunteer Signup Request",
      html: mailHtml,
      attachments: [
        {
          filename: "volunteer-banner.png",
          path: path.join(__dirname, "./cont.png"), // your provided image
          cid: "desifestbanner",
        },
      ],
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
