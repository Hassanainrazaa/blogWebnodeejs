const JWT = require('jsonwebtoken');

const secret = 'qwerty12345';  // Secret key, you should ideally store this in environment variables

// Function to create a token for a user
function createTokenForUser(user) {
    const payload = {
        username: user.username,
        role: user.role,
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
    };
    // Token created with user details and signed with secret
    const token = JWT.sign(payload, secret);  // Token will expire in 1 hour
    return token;
}

// Function to validate a token
function validateToken(token) {
    try {
        // Verify token with the secret key
        const payload = JWT.verify(token, secret);
        return payload;  // If valid, return the decoded payload
    } catch (error) {
        throw new Error('Invalid or expired token');  // Handle invalid tokens
    }
}

module.exports = {
    createTokenForUser,
    validateToken,
};
