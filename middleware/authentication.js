
const { validateToken } = require('../services/authentication');

function checkForAuthenticationCookies(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        // If there is no token, just proceed to the next middleware
        if (!tokenCookieValue) {
            return next();
        }

        try {
            // Validate the token
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad;  // Attach the decoded token/user info to the request object

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            // In case of error (like an invalid token), proceed to the next middleware
            return next();
        }
    };
}

module.exports = { checkForAuthenticationCookies };
