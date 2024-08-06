const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers["authorization"];

  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  // Verify the token
  jwt.verify(
    token.split(" ")[1],
    process.env.AUTH_SECRET_KEY,
    (err, decoded) => {
      // If the token is invalid or expired, return a 401 Unauthorized response
      if (err) {
        return res
          .status(401)
          .json({ error: true, message: "Failed to authenticate token." });
      }

      // If the token is valid, store the decoded user ID in the request object
      req.userId = decoded.userId;

      // Call the next middleware or route handler
      next();
    }
  );
};

module.exports = isAuthenticated;
