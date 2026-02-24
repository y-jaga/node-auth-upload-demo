const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  console.log(req.user);
  const { userId, username, role } = req.user;
  res.json({
    success: true,
    message: "Welcome to home page",
    user: { userId, username, role },
  });
});

module.exports = router;
