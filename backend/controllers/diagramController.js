const Diagram = require("../models/Diagram");
const User = require("../models/User");
const mongoose = require("mongoose");
const { validateDiagramStructure } = require("../validators/diagramValidator");

/**
 * Creates a new diagram for the authenticated user.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Diagram data.
 * @param {string} req.body.title - Diagram title.
 * @param {Array} req.body.nodes - Diagram nodes.
 * @param {Array} req.body.edges - Diagram connections.
 * @param {string} req.user.userId - Authenticated user ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Created diagram with generated ID.
 */
exports.createDiagram = async (req, res, next) => {
  try {
    const { title, description, nodes, edges, isTemplate, images } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        error: "Title is required and must be at least 3 characters",
      });
    }

    const structureValidation = validateDiagramStructure({
      nodes,
      edges,
      images,
    });
    if (!structureValidation.valid) {
      return res.status(400).json({
        error: "Diagram structure validation error",
        details: structureValidation.errors,
      });
    }

    const diagram = new Diagram({
      title: title.trim(),
      description: description?.trim() || "",
      userId: req.user.userId,
      nodes: nodes || [],
      edges: edges || [],
      isTemplate: isTemplate || false,
      images: images || [],
    });

    await diagram.save();

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: {
        "stats.diagramsCreated": 1,
        "stats.nodesCreated": (nodes || []).length,
      },
    });

    // Return created diagram
    res.status(201).json({
      message: "Diagram created successfully",
      diagram: {
        id: diagram._id,
        title: diagram.title,
        description: diagram.description,
        nodes: diagram.nodes,
        edges: diagram.edges,
        images: diagram.images,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A diagram with that title already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("❌ Error creating diagram:", error);
    next(error);
  }
};

/**
 * Retrieves all diagrams of the authenticated user.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Array} List of the user's diagrams.
 */
exports.getDiagrams = async (req, res, next) => {
  try {
    const diagrams = await Diagram.find({
      userId: req.user.userId,
      isTemplate: { $ne: true },
    })
      .select(
        "title description nodes edges images createdAt updatedAt isTemplate"
      )
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      diagrams: diagrams.map((diagram) => ({
        id: diagram._id,
        title: diagram.title,
        description: diagram.description,
        nodes: diagram.nodes || [],
        edges: diagram.edges || [],
        images: diagram.images || [],
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
        isTemplate: diagram.isTemplate || false,
      })),
    });
    } catch (error) {
    console.error("❌ Error fetching diagrams:", error);
    next(error);
  }
};

/**
 * Retrieves all templates of the authenticated user.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Array} List of the user's templates.
 */
exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await Diagram.find({
      userId: req.user.userId,
      isTemplate: true,
    })
      .select(
        "title description nodes edges images createdAt updatedAt isTemplate"
      )
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({
      templates: templates.map((template) => ({
        id: template._id,
        title: template.title,
        description: template.description,
        nodes: template.nodes || [],
        edges: template.edges || [],
        images: template.images || [],
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        isTemplate: template.isTemplate,
      })),
    });
    } catch (error) {
    console.error("❌ Error fetching templates:", error);
    next(error);
  }
};

/**
 * Deletes a diagram of the authenticated user.
 * @async
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the diagram to delete.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Deletion confirmation message.
 */
exports.deleteDiagram = async (req, res, next) => {
  try {
    const diagramId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    const diagram = await Diagram.findOneAndDelete({
      _id: diagramId,
      userId: req.user.userId,
    });

    if (!diagram) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    res.status(200).json({
      message: "Diagram deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting diagram:", error);
    next(error);
  }
};

/**
 * Retrieves a specific diagram by ID.
 * @async
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - Diagram ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Full diagram data.
 */
exports.getDiagramById = async (req, res, next) => {
  try {
    const diagramId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    const diagram = await Diagram.findOne({
      _id: diagramId,
      userId: req.user.userId,
    })
      .select("title description nodes edges images createdAt updatedAt")
      .lean();

    if (!diagram) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    res.status(200).json({
      diagram: {
        id: diagram._id,
        title: diagram.title,
        description: diagram.description,
        nodes: diagram.nodes,
        edges: diagram.edges,
        images: diagram.images,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching diagram by ID:", error);
    next(error);
  }
};

/**
 * Updates an existing diagram of the authenticated user.
 * @async
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - ID of the diagram to update.
 * @param {Object} req.body - New diagram data.
 * @param {string} req.body.title - New title.
 * @param {Array} req.body.nodes - New nodes.
 * @param {Array} req.body.edges - New connections.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Updated diagram.
 */
exports.updateDiagram = async (req, res, next) => {
  try {
    const diagramId = req.params.id;
    const { title, description, nodes, edges, images } = req.body;

    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    // Validate title if provided
    if (title !== undefined && (!title || title.trim().length < 3)) {
      return res.status(400).json({
        error: "The title must be at least 3 characters",
      });
    }

    // Validate structure of nodes, edges and images if provided
    if (nodes !== undefined || edges !== undefined || images !== undefined) {
      // Retrieve current diagram to merge with the new data
      const currentDiagram = await Diagram.findOne({
        _id: diagramId,
        userId: req.user.userId,
      });

      if (!currentDiagram) {
        return res.status(404).json({
          error: "Diagram not found or not authorised",
        });
      }

      const updatedNodes = nodes !== undefined ? nodes : currentDiagram.nodes;
      const updatedEdges = edges !== undefined ? edges : currentDiagram.edges;
      const updatedImages =
        images !== undefined ? images : currentDiagram.images;

      const structureValidation = validateDiagramStructure({
        nodes: updatedNodes,
        edges: updatedEdges,
        images: updatedImages,
      });

      if (!structureValidation.valid) {
        return res.status(400).json({
          error: "Diagram structure validation error",
          details: structureValidation.errors,
        });
      }
    }

    // Find diagram by ID and userId
    const diagram = await Diagram.findOne({
      _id: diagramId,
      userId: req.user.userId,
    });

    if (!diagram) {
      return res.status(404).json({
        error: "Diagram not found or not authorised",
      });
    }

    // Calculate change in number of nodes if they are updated
    let nodeDifference = 0;
    if (nodes !== undefined) {
      const oldNodeCount = diagram.nodes.length;
      const newNodeCount = nodes.length;
      nodeDifference = newNodeCount - oldNodeCount;
    }

    // Update diagram fields
    if (title !== undefined) diagram.title = title.trim();
    if (description !== undefined) diagram.description = description.trim();
    if (nodes !== undefined) diagram.nodes = nodes;
    if (edges !== undefined) diagram.edges = edges;
    if (images !== undefined) diagram.images = images;

    // Save changes
    await diagram.save();

    // Update user statistics if there is a change in nodes
    if (nodeDifference !== 0) {
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { "stats.nodesCreated": nodeDifference },
      });
    }

    // Return updated diagram
    res.status(200).json({
      message: "Diagram updated successfully",
      diagram: {
        id: diagram._id,
        title: diagram.title,
        description: diagram.description,
        nodes: diagram.nodes,
        edges: diagram.edges,
        images: diagram.images,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      },
    });
  } catch (error) {
    // Handle duplicate title error
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A diagram with that title already exists",
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("❌ Error updating diagram:", error);
    next(error);
  }
};
