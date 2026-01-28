const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "../uploads/images");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Uploads an image from a base64 file or from a URL.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Image data.
 * @param {string} req.body.image - Image in base64.
 * @param {string} req.body.filename - File name (optional).
 * @param {string} req.body.mimeType - Image MIME type (jpeg, png, gif, webp).
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Metadata of the uploaded image.
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { image, filename, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No image provided",
      });
    }

    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!mimeType || !validMimeTypes.includes(mimeType)) {
      return res.status(400).json({
        error: "Invalid image type. Use: jpeg, png, gif or webp",
      });
    }

    let base64Data;
    if (image.includes("base64,")) {
      base64Data = image.split("base64,")[1];
    } else {
      base64Data = image;
    }

    const buffer = Buffer.from(base64Data, "base64");
    const size = buffer.length;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (size > MAX_SIZE) {
      return res.status(400).json({
        error: "Image exceeds maximum size of 5MB",
      });
    }

    const extension = mimeType.split("/")[1];
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/images/${uniqueName}`;

    res.status(201).json({
      message: "Image uploaded successfully",
      image: {
        filename: filename || uniqueName,
        url: imageUrl,
        mimeType: mimeType,
        size: size,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    next(error);
  }
};

/**
 * Validates an external image URL.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Validation data.
 * @param {string} req.body.url - URL of the image to validate.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Metadata of the validated image.
 */
exports.validateImageUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "No URL provided",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({
        error: "Invalid URL",
      });
    }

    if (!parsedUrl.protocol.startsWith("http")) {
      return res.status(400).json({
        error: "URL must use HTTP or HTTPS protocol",
      });
    }

    let mimeType = "image/jpeg";
    const urlLower = url.toLowerCase();
    if (urlLower.includes(".png")) mimeType = "image/png";
    else if (urlLower.includes(".gif")) mimeType = "image/gif";
    else if (urlLower.includes(".webp")) mimeType = "image/webp";
    else if (urlLower.includes(".svg")) mimeType = "image/svg+xml";

    res.status(200).json({
      message: "URL validated successfully",
      image: {
        filename: url.split("/").pop() || "image",
        url: url,
        mimeType: mimeType,
        size: 0,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error validating URL:", error);
    next(error);
  }
};

/**
 * Deletes an image from the server.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body data.
 * @param {string} req.body.url - URL of the image to delete.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Deletion confirmation message.
 */
exports.deleteImage = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "No URL provided",
      });
    }

    if (url.startsWith("/uploads/images/")) {
      const filename = url.split("/").pop();
      const filePath = path.join(UPLOAD_DIR, filename);

        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).json({
          message: "Image deleted successfully",
        });
      }
    }

    res.status(200).json({
      message: "Referenced image removed (external URL)",
    });
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    next(error);
  }
};
