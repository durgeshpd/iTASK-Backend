const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
        // Get the token from cookies
        const { token } = req.cookies;

        // If no token, return unauthorized error
        if (!token) {
            return res.status(401).json({ error: "Authentication token is missing." });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the decoded token
        const user = await User.findById(decoded._id);

        // If user not found, return unauthorized error
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        // Attach user to the request object for later use
        req.user = user;

        // Call the next middleware or route handler
        next();

    } catch (err) {
        // Specific error for expired token
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired." });
        }

        // General error for invalid token
        console.error(err.message);
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = {
    userAuth,
};
