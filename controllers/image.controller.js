const {
  uploadToCloudinary,
  deleteUploadedFile,
} = require("../helper/cloudinary.helper.js");
const Image = require("../models/image.model.js");

const uploadImage = async (req, res) => {
  try {
    console.log(req.file);
    //check if file is missing and send error response accordingly
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image.",
      });
    }

    //upload to cloudinary
    const { url, public_id } = await uploadToCloudinary(req.file.path);

    //store the public_id, url, and userId info into database
    //create a new mongodb document
    const newUploadedImage = new Image({
      url,
      publicId: public_id,
      uploadedBy: req.user.userId,
    });

    //save the document to db
    await newUploadedImage.save();

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully to cloudinary.",
      image: newUploadedImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const fetchAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No images found." });
    }

    res.status(200).json({
      success: true,
      message: "Images fetched successsfully.",
      data: {
        currentPage: page + "/" + totalPages,
        totalImages,
        images,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    //validate image id
    const imageId = req.params.id;

    if (!imageId) {
      return res
        .status(400)
        .json({ success: false, error: "imageId is required." });
    }

    //validate image
    const imageToDelete = await Image.findById(imageId);
    if (!imageToDelete) {
      return res
        .status(404)
        .json({ success: false, error: "image not found." });
    }

    //check if user who uploaded image is the one who is deleting
    if (imageToDelete.uploadedBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, error: "image does not belong to the user." });
    }

    console.log(imageToDelete);

    //delete image from cloudinary
    await deleteUploadedFile(imageToDelete.publicId);

    //delete image from db model
    await imageToDelete.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { uploadImage, fetchAllImages, deleteImage };
