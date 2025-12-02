const mongoose = require('mongoose');

// Esquema de metadata de imagen
const ImageMetadataSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    mimeType: {
        type: String,
        required: true,
        enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        trim: true
    },
    size: {
        type: Number,
        required: true,
        min: 0,
        max: 5 * 1024 * 1024 // 5MB máximo
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const DiagramSchema = new mongoose.Schema({
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
        ref: 'User',
        required: true
    },
    images: {
        type: [ImageMetadataSchema],
        default: [],
        validate: {
            validator: function(images) {
                return images.length <= 10; // Máximo 10 imágenes por diagrama
            },
            message: 'Un diagrama no puede tener más de 10 imágenes'
        }
    },
    nodes: [{
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        position: {
            x: {
                type: Number,
                required: true
            },
            y: {
                type: Number,
                required: true
            }
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        image: {
            type: ImageMetadataSchema,
            required: false
        }
    }],
    edges: [{
        id: {
            type: String,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        target: {
            type: String,
            required: true
        },
        sourceHandle: {
            type: String,
            required: false
        },
        targetHandle: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        animated: {
            type: Boolean,
            required: false,
            default: false
        },
        style: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    }]
}, { timestamps: true });
 
DiagramSchema.index({ title: 1, userId: 1 }, { unique: true });
DiagramSchema.index({ userId: 1 });
DiagramSchema.index({ updatedAt: -1 });
DiagramSchema.index({ userId: 1, updatedAt: -1 });

const Diagram = mongoose.model('Diagram', DiagramSchema);
module.exports = Diagram;