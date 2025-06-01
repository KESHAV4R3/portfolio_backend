// in this util we will write the code to send the email

const nodemailer = require("nodemailer");
require('dotenv').config()

exports.sendMail = async (email, title, body) => {
    try {

        // transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // send email
        await transporter.sendMail({
            from: 'keshav kumar',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        });

    } catch (error) {
        console.error('Error occurred while sending email : ', error);
    }
}
