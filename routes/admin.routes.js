const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const isAdminUser = require("../middleware/admin.middleware.js");
const router = express.Router();

router.get("/welcome", authMiddleware, isAdminUser, (req, res) => {
  res.status(200).json("Welcome to admin page.");
});

module.exports = router;
