const mongoose = require("mongoose");

/**
 * Esquema de metadatos de imagen para diagramas.
 * @typedef {Object} ImageMetadata
 * @property {string} filename - Nombre del archivo.
 * @property {string} url - URL de la imagen.
 * @property {string} mimeType - Tipo MIME (jpeg, png, gif, webp).
 * @property {number} size - Tamaño en bytes (máximo 5MB).
 * @property {Date} createdAt - Fecha de creación.
 */
const ImageMetadataSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
      max: 5 * 1024 * 1024,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * Esquema de diagrama con nodos, edges e imágenes.
 * @typedef {Object} Diagram
 * @property {string} title - Título del diagrama (mínimo 3 caracteres).
 * @property {string} description - Descripción (máximo 500 caracteres).
 * @property {ObjectId} userId - ID del usuario propietario.
 * @property {boolean} isTemplate - Si es una plantilla pública.
 * @property {Array<ImageMetadata>} images - Imágenes del diagrama (máximo 10).
 * @property {Array<Object>} nodes - Nodos del diagrama.
 * @property {Array<Object>} edges - Conexiones entre nodos.
 */
const DiagramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxLength: 500,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [ImageMetadataSchema],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 10;
        },
        message: "Un diagrama no puede tener más de 10 imágenes",
      },
    },
    nodes: [
      {
        id: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        position: {
          x: {
            type: Number,
            required: true,
          },
          y: {
            type: Number,
            required: true,
          },
        },
        data: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        image: {
          type: ImageMetadataSchema,
          required: false,
        },
      },
    ],
    edges: [
      {
        id: {
          type: String,
          required: true,
        },
        source: {
          type: String,
          required: true,
        },
        target: {
          type: String,
          required: true,
        },
        sourceHandle: {
          type: String,
          required: false,
        },
        targetHandle: {
          type: String,
          required: false,
        },
        type: {
          type: String,
          required: false,
        },
        animated: {
          type: Boolean,
          required: false,
          default: false,
        },
        style: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        data: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],
  },
  { timestamps: true }
);

DiagramSchema.index({ title: 1, userId: 1 }, { unique: true });
DiagramSchema.index({ userId: 1 });
DiagramSchema.index({ updatedAt: -1 });
DiagramSchema.index({ userId: 1, updatedAt: -1 });

const Diagram = mongoose.model("Diagram", DiagramSchema);
module.exports = Diagram;
