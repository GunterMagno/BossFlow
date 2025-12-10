const Diagram = require("../models/Diagram");
const User = require("../models/User");
const mongoose = require("mongoose");
const { validateDiagramStructure } = require("../validators/diagramValidator");

/**
 * Crea un nuevo diagrama para el usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Datos del diagrama.
 * @param {string} req.body.title - Título del diagrama.
 * @param {Array} req.body.nodes - Nodos del diagrama.
 * @param {Array} req.body.edges - Conexiones del diagrama.
 * @param {string} req.user.userId - ID del usuario autenticado.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Diagrama creado con ID generado.
 */
exports.createDiagram = async (req, res, next) => {
  try {
    const { title, description, nodes, edges, isTemplate, images } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        error: "El título es requerido y debe tener al menos 3 caracteres",
      });
    }

    const structureValidation = validateDiagramStructure({
      nodes,
      edges,
      images,
    });
    if (!structureValidation.valid) {
      return res.status(400).json({
        error: "Error de validación en la estructura del diagrama",
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

    // Retornar diagrama creado
    res.status(201).json({
      message: "Diagrama creado exitosamente",
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
        error: "Ya existe un diagrama con ese título",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("❌ Error al crear diagrama:", error);
    next(error);
  }
};

/**
 * Obtiene todos los diagramas del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Array} Lista de diagramas del usuario.
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
    console.error("❌ Error al obtener diagramas:", error);
    next(error);
  }
};

/**
 * Obtiene todas las plantillas del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Array} Lista de plantillas del usuario.
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
    console.error("❌ Error al obtener plantillas:", error);
    next(error);
  }
};

/**
 * Elimina un diagrama del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {string} req.params.id - ID del diagrama a eliminar.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Mensaje de confirmación de eliminación.
 */
exports.deleteDiagram = async (req, res, next) => {
  try {
    const diagramId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagrama no encontrado o no autorizado",
      });
    }

    const diagram = await Diagram.findOneAndDelete({
      _id: diagramId,
      userId: req.user.userId,
    });

    if (!diagram) {
      return res.status(404).json({
        error: "Diagrama no encontrado o no autorizado",
      });
    }

    res.status(200).json({
      message: "Diagrama eliminado exitosamente",
    });
  } catch (error) {
    console.error("❌ Error al eliminar diagrama:", error);
    next(error);
  }
};

/**
 * Obtiene un diagrama específico por ID.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {string} req.params.id - ID del diagrama.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Datos completos del diagrama.
 */
exports.getDiagramById = async (req, res, next) => {
  try {
    const diagramId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagrama no encontrado o no autorizado",
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
        error: "Diagrama no encontrado o no autorizado",
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
    console.error("❌ Error al obtener diagrama por ID:", error);
    next(error);
  }
};

/**
 * Actualiza un diagrama existente del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {string} req.params.id - ID del diagrama a actualizar.
 * @param {Object} req.body - Nuevos datos del diagrama.
 * @param {string} req.body.title - Nuevo título.
 * @param {Array} req.body.nodes - Nuevos nodos.
 * @param {Array} req.body.edges - Nuevas conexiones.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Function} next - Middleware de siguiente en la cadena.
 * @returns {Object} Diagrama actualizado.
 */
exports.updateDiagram = async (req, res, next) => {
  try {
    const diagramId = req.params.id;
    const { title, description, nodes, edges, images } = req.body;

    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(diagramId)) {
      return res.status(404).json({
        error: "Diagrama no encontrado o no autorizado",
      });
    }

    // Validar título si se proporciona
    if (title !== undefined && (!title || title.trim().length < 3)) {
      return res.status(400).json({
        error: "El título debe tener al menos 3 caracteres",
      });
    }

    // Validar estructura de nodos, edges e imágenes si se proporcionan
    if (nodes !== undefined || edges !== undefined || images !== undefined) {
      // Obtener el diagrama actual para combinar con los nuevos datos
      const currentDiagram = await Diagram.findOne({
        _id: diagramId,
        userId: req.user.userId,
      });

      if (!currentDiagram) {
        return res.status(404).json({
          error: "Diagrama no encontrado o no autorizado",
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
          error: "Error de validación en la estructura del diagrama",
          details: structureValidation.errors,
        });
      }
    }

    // Buscar diagrama por ID y userId
    const diagram = await Diagram.findOne({
      _id: diagramId,
      userId: req.user.userId,
    });

    if (!diagram) {
      return res.status(404).json({
        error: "Diagrama no encontrado o no autorizado",
      });
    }

    // Calcular cambio en número de nodos si se actualizan
    let nodeDifference = 0;
    if (nodes !== undefined) {
      const oldNodeCount = diagram.nodes.length;
      const newNodeCount = nodes.length;
      nodeDifference = newNodeCount - oldNodeCount;
    }

    // Actualizar campos del diagrama
    if (title !== undefined) diagram.title = title.trim();
    if (description !== undefined) diagram.description = description.trim();
    if (nodes !== undefined) diagram.nodes = nodes;
    if (edges !== undefined) diagram.edges = edges;
    if (images !== undefined) diagram.images = images;

    // Guardar cambios
    await diagram.save();

    // Actualizar estadísticas del usuario si hay cambio en nodos
    if (nodeDifference !== 0) {
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { "stats.nodesCreated": nodeDifference },
      });
    }

    // Retornar diagrama actualizado
    res.status(200).json({
      message: "Diagrama actualizado exitosamente",
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
    // Manejar error de título duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Ya existe un diagrama con ese título",
      });
    }

    // Manejar errores de validación de Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("❌ Error al actualizar diagrama:", error);
    next(error);
  }
};
