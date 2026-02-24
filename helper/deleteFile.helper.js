const fs = require("fs").promises;

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log("File deleted successfully!");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn("File does not exists, skipping deletion");
    } else {
      console.error("Error deleting file:", err);
      throw err;
    }
  }
};

module.exports = deleteFile;
