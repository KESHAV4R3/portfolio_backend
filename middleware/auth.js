const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || decoded.email != process.env.MAIL_USER) {
            return res.status(401).json({
                success: false,
                message: "invalid token"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "authentication failed"
        })
    }
}