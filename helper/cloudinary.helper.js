const cloudinary = require("../config/cloudinary.js");
const deleteFile = require("./deleteFile.helper.js");

const uploadToCloudinary = async (filePath) => {
  try {
    const uploadedFile = await cloudinary.uploader.upload(filePath);

    console.log("File uploaded to cloudinary successfully.");

    await deleteFile(filePath);

    return {
      url: uploadedFile.secure_url,
      public_id: uploadedFile.public_id,
    };
  } catch (error) {
    console.log("Error while uploading file to cloudinary", error);
  }
};

const deleteUploadedFile = async (publicId) => {
  try {
    const deletedResult = await cloudinary.uploader.destroy(publicId);

    console.log("File deleted successfully from cloudinary.");

    return deletedResult;
  } catch (error) {
    console.error("Error while deleting file from cloudinary");
    throw error;
  }
};

module.exports = { uploadToCloudinary, deleteUploadedFile };
