const auth = require("./authMiddleware");

const optionalAuth = (req, res, next) => {
    if (req.headers.authorization) {
        auth(req, res, next);
    } else {
        next();
    }
}

module.exports = optionalAuth