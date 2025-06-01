const User = require('../model/user')
const { sendMail } = require('../util/sendMail');
require('dotenv').config();


exports.sendMailToAdmin = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }
        console.log(name, email, message)

        // add it to the database
        const newUser = await User.findOne({ email });
        if (newUser) {
            newUser.queryRaised.push(message);
            newUser.lastActive = Date.now();
            await newUser.save();
        }
        else {
            await User.create({
                name,
                email,
                queryRaised: [message]
            });
        }

        // now send the mail to the admin
        const mailToAdmin =
            `

        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Message from Portfolio</title>
  <style>
    body {
      background-color: #000000;
      color: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111111;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 30px 25px;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.08);
    }

    .header {
      text-align: center;
      border-bottom: 1px solid #333333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
    }

    .label {
      font-weight: bold;
      font-size: 15px;
      color: #ffffff;
    }

    .info-section {
      margin: 15px 0;
    }

    .message-box {
      background-color: #1a1a1a;
      border: 1px solid #444444;
      border-radius: 8px;
      padding: 18px;
      margin-top: 10px;
      font-size: 15px;
      color: #dddddd;
      line-height: 1.7;
    }

    .footer {
      margin-top: 40px;
      border-top: 1px solid #333333;
      padding-top: 15px;
      text-align: center;
      font-size: 13px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📩 New Message from Portfolio</h2>
    </div>

    <div class="info-section">
      <p><span class="label">Name:</span> ${name}</p>
      <p><span class="label">Email:</span> ${email}</p>
    </div>

    <div class="info-section">
      <p><span class="label">Message:</span></p>
      <div class="message-box">
        ${message}
      </div>
    </div>

    <div class="footer">
      © 2025 Keshav Kumar | All rights reserved.
    </div>
  </div>
</body>
</html>


        `
        try {
            await sendMail(process.env.MAIL_USER, "service request from portfolio", mailToAdmin);
        } catch (error) {
            console.log("unable to send mail to admin ", error)
        }

        // send mail to user for conformation
        const conformationMailToUser =
            `
            <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Thank You for Your Enquiry</title>
    <style>
        body {
        background-color: #000000;
        color: #ffffff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 0;
        margin: 0;
        }

        .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #111111;
        border: 1px solid #333333;
        border-radius: 12px;
        padding: 30px 25px;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }

        .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #333333;
        }

        .header h2 {
        margin: 0;
        color: #ffffff;
        font-size: 24px;
        }

        .message {
        margin-top: 30px;
        font-size: 16px;
        line-height: 1.8;
        color: #dddddd;
        }

        .highlight {
        color: #ffffff;
        font-weight: bold;
        }

        .footer {
        margin-top: 40px;
        border-top: 1px solid #333333;
        padding-top: 15px;
        text-align: center;
        font-size: 13px;
        color: #999999;
        }

        .signature {
        margin-top: 30px;
        font-size: 16px;
        color: #ffffff;
        }

        .signature b {
        color: #ffffff;
        }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
        <h2>🤝 Thank You for Reaching Out</h2>
        </div>

        <div class="message">
        <p>Hi <span class="highlight">${name}</span>,</p>
        <p>Thank you for getting in touch with me. I appreciate your interest and the time you took to reach out.</p>
        <p><span class="highlight">Your enquiry has been received</span>, and I’ll get back to you shortly with a response.</p>
        <p>If it’s something urgent, feel free to reply to this email directly.</p>
        <p>Looking forward to speaking with you soon!</p>
        </div>

        <div class="signature">
        <p>Warm regards,<br><b>Keshav Kumar</b></p>
        </div>

        <div class="footer">
        &copy; 2025 Keshav Kumar | Portfolio Website
        </div>
    </div>
    </body>
    </html>
        `
        await sendMail(email, "message from keshav", conformationMailToUser)

        return res.status(200).json({
            success: true,
            message: "successfully send mail to admin"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server errro , unable to send mail to admin"
        })
    }
}


exports.sendMailToUser = async (req, res) => {
    try {
        const { email, name, message, query } = req.body;
        if (!email || !name || !message || !query) {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        const mailToUser =
            `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Message from Admin</title>
  <style>
    body {
      background-color: #000000;
      color: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #111111;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 30px 25px;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.08);
    }

    .header {
      text-align: center;
      border-bottom: 1px solid #333333;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }

    .header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
    }

    .label {
      font-weight: bold;
      font-size: 16px;
      color: #ffffff;
    }

    .section {
      margin-bottom: 25px;
      font-size: 16px;
      color: #dddddd;
      line-height: 1.8;
    }

    .message-box, .query-box {
      background-color: #1a1a1a;
      border: 1px solid #444444;
      border-radius: 8px;
      padding: 18px;
      font-size: 15px;
      color: #dddddd;
      margin-top: 10px;
    }

    .footer {
      margin-top: 40px;
      border-top: 1px solid #333333;
      padding-top: 15px;
      text-align: center;
      font-size: 13px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📬 Message from Keshav</h2>
    </div>

    <div class="section">
      <p><span class="label">Hello ${name},</span></p>
      <p>You have received a new message from <b>Keshav</b> regarding your recent enquiry:</p>

      <div class="query-box">
        <span class="label">Your Query:</span><br />
        ${query}
      </div>

      <p style="margin-top: 20px;">This is a reply from admin regarding your query:</p>

      <div class="message-box">
        ${message}
      </div>

      <p>If you have any questions or need further assistance, feel free to reply to this email.</p>
    </div>

    <div class="footer">
      &copy; 2025 Keshav Kumar | Portfolio Website
    </div>
  </div>
</body>
</html>

        `
        await sendMail(email, "mail by keshav regarding your service request", mailToUser);

        return res.status(200).json({
            success: true,
            message: "mail send succesfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server errro , unable to send mail to user"
        })
    }
}
exports.register = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }
        // add it to the database
        const newUser = await User.findOne({ email });
        if (newUser) {
            newUser.queryRaised.push(message);
            newUser.lastActive = Date.now()
            await newUser.save();
        }
        else {
            await User.create({
                name,
                email,
                queryRaised: [message]
            });
        }

        return res.status(200).json(
            {
                success: true,
                message: "user detail saved to database"
            }
        )
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server errror , unable to register user"
        })
    }
}


exports.makeUserActive = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400)
                .json({
                    success: false,
                    message: "all credentials are required"
                })
        }

        const user = await User.findByIdAndUpdate(userId, { $set: { isActive: true } });
        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "no user found"
                })
        }

        return res.status(200).json({
            success: true,
            message: "user added to active list"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error , unable to add user in active list"
        });
    }
}


exports.removeUserActive = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400)
                .json({
                    success: false,
                    message: "all credentials are required"
                })
        }

        const user = await User.findByIdAndUpdate(userId, { $set: { isActive: false } });
        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "no user found"
                })
        }

        return res.status(200).json({
            success: false,
            message: "user removed from active list"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error , unable to remove user in active list"
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400)
                .json({
                    success: false,
                    message: "all credentials are required"
                })
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user deleted successfully"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error , unable to delete user"
        });
    }
}