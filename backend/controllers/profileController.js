const User = require("../models/User");

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
