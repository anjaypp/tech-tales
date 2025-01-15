const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access, token missing or invalid" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object

        // Log the decoded token
        console.log("Decoded token:", decoded);
        console.log("Decoded user:", req.user);
        console.log("Decoded user:", req.role);

        // Check for role 
        if (req.user.role !== 'user' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You need an account to view and interact with this content." });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = isAuthenticated;
