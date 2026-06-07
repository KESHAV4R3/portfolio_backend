const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendMail = async (to, subject, htmlContent) => {
    console.log(`[sendMail] ► Called | to: ${to} | subject: "${subject}"`);

    try {
        // --- [1] ENV VARIABLE CHECK ---
        console.log('[sendMail] [1] Checking SMTP env variables...');
        console.log(`[sendMail]     MAIL_HOST     : ${process.env.MAIL_HOST || '❌ MISSING'}`);
        console.log(`[sendMail]     MAIL_PORT     : ${process.env.MAIL_PORT || '⚠️  NOT SET (will use 587)'}`);
        console.log(`[sendMail]     SMTP_USER     : ${process.env.SMTP_USER ? '✅ SET' : '❌ MISSING'}`);
        console.log(`[sendMail]     SMTP_PASSWORD : ${process.env.SMTP_PASSWORD ? '✅ SET' : '❌ MISSING'}`);
        console.log(`[sendMail]     SMTP_SECURE   : ${process.env.SMTP_SECURE || '⚠️  NOT SET (defaults to false)'}`);

        if (!process.env.MAIL_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.error('[sendMail] ❌ SMTP configuration is incomplete. Aborting.');
            throw new Error('SMTP configuration is missing. Please check your environment variables');
        }

        // --- [2] TRANSPORTER CREATION ---
        const smtpPort = parseInt(process.env.MAIL_PORT) || 587;
        const smtpSecure = process.env.SMTP_SECURE === 'true';
        console.log(`[sendMail] [2] Creating transporter | host: ${process.env.MAIL_HOST} | port: ${smtpPort} | secure: ${smtpSecure}`);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // --- [3] VERIFY TRANSPORTER ---
        console.log('[sendMail] [3] Verifying transporter connection...');
        try {
            await transporter.verify();
            console.log('[sendMail]     ✅ Transporter verified successfully');
        } catch (verifyError) {
            console.error('[sendMail]     ❌ Transporter verification FAILED:', verifyError.message);
            throw verifyError;
        }

        // --- [4] SEND MAIL ---
        const mailOptions = {
            from: `"Keshav Kumar" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: htmlContent
        };
        console.log(`[sendMail] [4] Sending mail to: ${to}`);

        const info = await transporter.sendMail(mailOptions);
        console.log(`[sendMail] ✅ Mail sent successfully | messageId: ${info.messageId} | response: ${info.response}`);
        return info;

    } catch (error) {
        console.error(`[sendMail] ❌ sendMail FAILED | to: ${to} | Error: ${error.message}`);
        console.error('[sendMail]    Error stack:', error.stack);
        throw error;
    }
};
