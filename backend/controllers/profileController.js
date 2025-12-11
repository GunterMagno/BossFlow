const User = require("../models/User");
const Diagram = require("../models/Diagram");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

/**
 * Obtiene el perfil del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} Datos del perfil del usuario sin contraseña.
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.body - Campos a actualizar.
 * @param {string} req.body.username - Nuevo nombre de usuario (mínimo 3 caracteres).
 * @param {string} req.body.bio - Nueva biografía (máximo 500 caracteres).
 * @param {Array} req.body.favoriteGames - Nuevos juegos favoritos (máximo 10).
 * @param {string} req.body.avatar - URL del nuevo avatar.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} Usuario actualizado sin contraseña.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, favoriteGames, avatar } = req.body;
    const userId = req.user.userId;

    // Campos permitidos para actualizar
    const updateData = {};

    if (username !== undefined) {
      // Validar que el username no esté en uso por otro usuario
      if (username.length < 3) {
        return res
          .status(400)
          .json({
            error: "El nombre de usuario debe tener al menos 3 caracteres",
          });
      }

      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "El nombre de usuario ya está en uso" });
      }
      updateData.username = username;
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res
          .status(400)
          .json({ error: "La biografía no puede exceder 500 caracteres" });
      }
      updateData.bio = bio;
    }

    if (favoriteGames !== undefined) {
      if (!Array.isArray(favoriteGames)) {
        return res
          .status(400)
          .json({ error: "Los juegos favoritos deben ser un array" });
      }
      if (favoriteGames.length > 10) {
        return res
          .status(400)
          .json({ error: "No puedes tener más de 10 juegos favoritos" });
      }
      updateData.favoriteGames = favoriteGames;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }

    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

/**
 * Obtiene las estadísticas y logros del usuario autenticado.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} Estadísticas y logros del usuario.
 */
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "stats achievements"
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      stats: user.stats,
      achievements: user.achievements,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

/**
 * Exporta todos los datos personales del usuario en formato JSON.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} JSON con todos los datos del usuario y sus diagramas.
 */
exports.exportUserData = async (req, res) => {
  try {
    const Diagram = require("../models/Diagram");
    const userId = req.user.userId;

    // Obtener datos del usuario
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtiene todos los diagramas del usuario
    const diagrams = await Diagram.find({ userId }).lean();

    // Construye el objeto de exportación
    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: "full_user_data",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        favoriteGames: user.favoriteGames,
        createdAt: user.createdAt,
        lastActivity: user.lastActivity,
        stats: user.stats,
        achievements: user.achievements,
      },
      diagrams: diagrams.map((diagram) => ({
        id: diagram._id,
        title: diagram.title,
        description: diagram.description,
        isTemplate: diagram.isTemplate,
        isPublic: diagram.isPublic,
        nodes: diagram.nodes,
        edges: diagram.edges,
        viewport: diagram.viewport,
        createdAt: diagram.createdAt,
        updatedAt: diagram.updatedAt,
      })),
      metadata: {
        totalDiagrams: diagrams.length,
        totalNodes: diagrams.reduce(
          (sum, d) => sum + (d.nodes?.length || 0),
          0
        ),
        totalTemplates: diagrams.filter((d) => d.isTemplate).length,
      },
    };

    // Configura headers para descarga
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bossflow_data_${user.username}_${Date.now()}.json"`
    );

    res.json(exportData);
  } catch (error) {
    console.error("Error al exportar datos:", error);
    res.status(500).json({ error: "Error al exportar datos del usuario" });
  }
};

/**
 * Elimina permanentemente la cuenta del usuario y todos sus datos.
 * @async
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} req.user - Usuario autenticado.
 * @param {string} req.user.userId - ID del usuario.
 * @param {Object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.confirmPassword - Contraseña para confirmar eliminación.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Object} Mensaje de confirmación de eliminación.
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { confirmPassword } = req.body;

    // Valida que se proporcione la contraseña de confirmación
    if (!confirmPassword) {
      return res.status(400).json({
        error: "Debes proporcionar tu contraseña para confirmar la eliminación",
      });
    }

    // Obtiene usuario con contraseña
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verifica contraseña
    const isPasswordValid = await bcrypt.compare(
      confirmPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Contraseña incorrecta. No se puede eliminar la cuenta" });
    }

    // Obtiene todos los diagramas del usuario
    const diagrams = await Diagram.find({ userId });

    // Elimina imágenes asociadas a los diagramas
    for (const diagram of diagrams) {
      if (diagram.nodes && Array.isArray(diagram.nodes)) {
        for (const node of diagram.nodes) {
          if (
            node.data?.imageUrl &&
            node.data.imageUrl.includes("/uploads/images/")
          ) {
            try {
              const filename = path.basename(node.data.imageUrl);
              const imagePath = path.join(
                __dirname,
                "..",
                "uploads",
                "images",
                filename
              );
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            } catch (err) {
              console.error("Error al eliminar imagen:", err);
              // Continúa con la eliminación aunque falle borrar una imagen
            }
          }
        }
      }
    }

    // Elimina todos los diagramas del usuario
    await Diagram.deleteMany({ userId });

    // Elimina el usuario
    await User.findByIdAndDelete(userId);

    console.log(
      `✅ Cuenta eliminada: Usuario ${user.username} (${user.email})`
    );

    res.json({
      message: "Tu cuenta y todos tus datos han sido eliminados permanentemente",
      deletedUser: user.username,
      deletedDiagrams: diagrams.length,
    });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(500).json({ error: "Error al eliminar la cuenta" });
  }
};
