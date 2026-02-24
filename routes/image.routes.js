const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const isAdminUser = require("../middleware/admin.middleware.js");
const upload = require("../middleware/upload.middleware.js");
const {
  uploadImage,
  fetchAllImages,
  deleteImage,
} = require("../controllers/image.controller.js");

const router = express.Router();

router.post(
  "/uploads",
  authMiddleware,
  isAdminUser,
  upload.single("image"),
  uploadImage,
);

router.get("/", authMiddleware, fetchAllImages);

router.delete("/:id", authMiddleware, deleteImage);

module.exports = router;
