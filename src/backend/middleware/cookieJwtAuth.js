const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token; // Get the JWT from cookies
    try{
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify the token using the secret key
        req.user = user; // Attach the user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch(err){
        res.clearCookie('token'); // Clear the cookie if verification fails
        return res.redirect("/login"); // Redirect to login page if token is invalid or expired
    }

};