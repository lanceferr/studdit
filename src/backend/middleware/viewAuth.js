// middleware/viewAuth.js
const jwt = require('jsonwebtoken');

exports.viewAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = user;
            res.locals.user = user; // Make user available to all views
        } catch (err) {
            // Don't redirect, just clear invalid token
            res.clearCookie('token');
        }
    }
    next();
};