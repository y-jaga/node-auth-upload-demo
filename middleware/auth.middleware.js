const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, error: "Invalid JWT token" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedUser;
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid JWT token" });
  }

  next();
};

module.exports = authMiddleware;
