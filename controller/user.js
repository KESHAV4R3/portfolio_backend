const User = require('../model/user')
const { sendMail } = require('../util/sendMail');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.userLogin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "all credentials are required"
      })
    }

    if (userName === process.env.SMTP_USER && password === process.env.password) {
      const user = {
        email: process.env.SMTP_USER,
        role: "Admin"
      }

      try {
        const token = jwt.sign(
          user,
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        return res.status(200).cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'None',
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
          success: true,
          message: 'Logged in and cookie sent',
        });
      } catch (tokenError) {
        throw new Error('Failed to create authentication token');
      }

    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message || 'Unable to login'}`
    })
  }
}

exports.automaticLogin = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "no token found"
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.email != process.env.SMTP_USER) {
      return res.status(401).json({
        success: false,
        message: "invalid token"
      })
    }
    return res.status(200).json({ success: true, message: "user logged in successful" })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "authentication failed"
    })
  }
}


exports.sendMailToAdmin = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials"
      })
    }

    const newUser = await User.findOne({ email });
    if (newUser) {
      newUser.queryRaised.push(message);
      newUser.lastActive = Date.now();
      await newUser.save();
    } else {
      await User.create({
        name,
        email,
        queryRaised: [message]
      });
    }

    const mailToAdmin = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; font-size: 14px; color: #333; padding: 20px;">
  <h3>📩 New Portfolio Message</h3>
  <hr style="border: none; border-top: 1px solid #ddd;">
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <p style="background: #f5f5f5; padding: 12px; border-left: 3px solid #555;">${message}</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
  <p style="font-size: 12px; color: #999;">This is a system generated email. Please do not reply to this email.</p>
</body>
</html>`;

    try {
      await sendMail(process.env.SMTP_USER, "service request from portfolio", mailToAdmin);
    } catch (error) {
      // admin mail failed silently
    }

    const conformationMailToUser = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; font-size: 14px; color: #333; padding: 20px;">
  <h3>Thanks for reaching out, ${name}!</h3>
  <hr style="border: none; border-top: 1px solid #ddd;">
  <p>Your message has been received. I'll get back to you as soon as possible.</p>
  <p>If it's urgent, feel free to reply to this email.</p>
  <br>
  <p>Warm regards,<br><strong>Keshav Kumar</strong></p>
  <hr style="border: none; border-top: 1px solid #ddd; margin-top: 30px;">
  <p style="font-size: 12px; color: #999;">This is a system generated email. Please do not reply to this email directly.</p>
</body>
</html>`;

    try {
      await sendMail(email, "message from keshav", conformationMailToUser);
      return res.status(200).json({
        success: true,
        message: "successfully sent mail to admin and confirmation to user"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Email to admin sent, but failed to send confirmation to user"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error, unable to send mail to admin"
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

    const mailToUser = `
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
      message: "internal server error, unable to send mail to user"
    })
  }
}


exports.makeUserActive = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "all credentials are required"
      })
    }

    const user = await User.findByIdAndUpdate(userId, { $set: { isActive: true } });
    if (!user) {
      return res.status(400).json({
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
      message: "Server error, unable to add user in active list"
    });
  }
}


exports.removeUserActive = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "all credentials are required"
      })
    }

    const user = await User.findByIdAndUpdate(userId, { $set: { isActive: false } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "no user found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "user removed from active list"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, unable to remove user from active list"
    });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "all credentials are required"
      })
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "user deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error, unable to delete user"
    });
  }
}

exports.getAllUser = async (req, res) => {
  try {
    const allData = await User.find({}).lean();
    return res.status(200).json({
      success: true,
      Users: allData
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "user not found"
    })
  }
}