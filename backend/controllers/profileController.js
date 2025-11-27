const User = require('../models/User');

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, favoriteGames, avatar } = req.body;
    const userId = req.user.userId;

    // Campos permitidos para actualizar
    const updateData = {};

    if (username !== undefined) {
      // Validar que el username no esté en uso por otro usuario
      if (username.length < 3) {
        return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
      }

      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }
      updateData.username = username;
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({ error: 'La biografía no puede exceder 500 caracteres' });
      }
      updateData.bio = bio;
    }

    if (favoriteGames !== undefined) {
      if (!Array.isArray(favoriteGames)) {
        return res.status(400).json({ error: 'Los juegos favoritos deben ser un array' });
      }
      if (favoriteGames.length > 10) {
        return res.status(400).json({ error: 'No puedes tener más de 10 juegos favoritos' });
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
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);

    if (error.code === 11000) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Obtener estadísticas del usuario
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('stats achievements');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      stats: user.stats,
      achievements: user.achievements
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
