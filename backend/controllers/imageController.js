const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "../uploads/images");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Sube una imagen desde archivo en base64 o desde URL.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Datos de la imagen.
 * @param {string} req.body.image - Imagen en base64.
 * @param {string} req.body.filename - Nombre del archivo (opcional).
 * @param {string} req.body.mimeType - Tipo MIME de la imagen (jpeg, png, gif, webp).
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Metadatos de la imagen subida.
 */
exports.uploadImage = async (req, res, next) => {
  try {
    const { image, filename, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({
        error: "No se proporcionó ninguna imagen",
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
        error: "Tipo de imagen no válido. Use: jpeg, png, gif o webp",
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
        error: "La imagen excede el tamaño máximo de 5MB",
      });
    }

    const extension = mimeType.split("/")[1];
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/images/${uniqueName}`;

    res.status(201).json({
      message: "Imagen subida exitosamente",
      image: {
        filename: filename || uniqueName,
        url: imageUrl,
        mimeType: mimeType,
        size: size,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    next(error);
  }
};

/**
 * Valida una URL de imagen externa.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Datos de validación.
 * @param {string} req.body.url - URL de la imagen a validar.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Metadatos de la imagen validada.
 */
exports.validateImageUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "No se proporcionó ninguna URL",
      });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({
        error: "URL no válida",
      });
    }

    if (!parsedUrl.protocol.startsWith("http")) {
      return res.status(400).json({
        error: "La URL debe usar protocolo HTTP o HTTPS",
      });
    }

    let mimeType = "image/jpeg";
    const urlLower = url.toLowerCase();
    if (urlLower.includes(".png")) mimeType = "image/png";
    else if (urlLower.includes(".gif")) mimeType = "image/gif";
    else if (urlLower.includes(".webp")) mimeType = "image/webp";
    else if (urlLower.includes(".svg")) mimeType = "image/svg+xml";

    res.status(200).json({
      message: "URL validada exitosamente",
      image: {
        filename: url.split("/").pop() || "image",
        url: url,
        mimeType: mimeType,
        size: 0,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Error al validar URL:", error);
    next(error);
  }
};

/**
 * Elimina una imagen del servidor.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Datos de la solicitud.
 * @param {string} req.body.url - URL de la imagen a eliminar.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Mensaje de confirmación de eliminación.
 */
exports.deleteImage = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        error: "No se proporcionó ninguna URL",
      });
    }

    if (url.startsWith("/uploads/images/")) {
      const filename = url.split("/").pop();
      const filePath = path.join(UPLOAD_DIR, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.status(200).json({
          message: "Imagen eliminada exitosamente",
        });
      }
    }

    res.status(200).json({
      message: "Imagen referenciada eliminada (URL externa)",
    });
  } catch (error) {
    console.error("❌ Error al eliminar imagen:", error);
    next(error);
  }
};
