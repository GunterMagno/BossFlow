const mongoose = require('mongoose');

const DiagramSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
    nodes: {
        type: Array,
        default: []
    },
    edges: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Diagram = mongoose.model('Diagram', DiagramSchema);
module.exports = Diagram;