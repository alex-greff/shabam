const jwt = require('jsonwebtoken');
const canDoAllOperations = require("../roles/role-check");

module.exports = (checkSelf, ...operations) => {
    return (req, res, next) => {
        try {
            // Validate token
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userData = decoded;
    
            console.log("USER DATA\n", req.userData); // TODO: remove?

            // Check if user has access
            if (req.userData && canDoAllOperations(req.userData.role, ...operations)) {
                req.userAccessType = "role";
                next();
            }
            // Check if the user is self
            else if (checkSelf && req.userData.userId === req.params.userID) {
                req.userAccessType = "self";
                next();
            }
            else {
                res.status(401).json({
                    message: 'Authorization failed'
                });
            }
        } catch (error) {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
    }
}