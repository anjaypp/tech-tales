const roleCheck = (requiredRole) => (req, res, next) => {
    if(!req.user || req.user.role !== requiredRole){
        return res.status(403).json({ message: "Unauthorized access, insufficient permissions" });
    }
    next();
    }

module.exports = roleCheck;