const User = require("../models/User");
const Diagram = require("../models/Diagram");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

/**
 * Retrieves the authenticated user's profile.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} User profile data without password.
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
};

/**
 * Updates the authenticated user's profile.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Fields to update.
 * @param {string} req.body.username - New username (minimum 3 characters).
 * @param {string} req.body.bio - New biography (maximum 500 characters).
 * @param {Array} req.body.favoriteGames - New favourite games (maximum 10).
 * @param {string} req.body.avatar - URL of the new avatar.
 * @param {Object} res - Express response object.
 * @returns {Object} Updated user without password.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, favoriteGames, avatar } = req.body;
    const userId = req.user.userId;

    // Allowed fields to update
    const updateData = {};

    if (username !== undefined) {
      // Validate that the username is not used by another user
      if (username.length < 3) {
        return res
          .status(400)
          .json({
            error: "Username must be at least 3 characters",
          });
      }

      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username is already in use" });
      }
      updateData.username = username;
    }

    if (bio !== undefined) {
      if (bio.length > 500) {
        return res
          .status(400)
          .json({ error: "Biography cannot exceed 500 characters" });
      }
      updateData.bio = bio;
    }

    if (favoriteGames !== undefined) {
      if (!Array.isArray(favoriteGames)) {
        return res
          .status(400)
          .json({ error: "Favourite games must be an array" });
      }
      if (favoriteGames.length > 10) {
        return res
          .status(400)
          .json({ error: "You cannot have more than 10 favourite games" });
      }
      updateData.favoriteGames = favoriteGames;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Username is already in use" });
    }

    res.status(500).json({ error: "Error updating profile" });
  }
};

/**
 * Retrieves the authenticated user's statistics and achievements.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} User statistics and achievements.
 */
exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "stats achievements"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      stats: user.stats,
      achievements: user.achievements,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
};

/**
 * Exports all personal data of the user in JSON format.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON with the user's data and their diagrams.
 */
exports.exportUserData = async (req, res) => {
  try {
    const Diagram = require("../models/Diagram");
    const userId = req.user.userId;

    // Get user data
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all diagrams of the user
    const diagrams = await Diagram.find({ userId }).lean();

    // Build the export object
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

    // Set headers for download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bossflow_data_${user.username}_${Date.now()}.json"`
    );

    res.json(exportData);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Error exporting user data" });
  }
};

/**
 * Permanently deletes the user's account and all their data.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.user - Authenticated user.
 * @param {string} req.user.userId - User ID.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.confirmPassword - Password to confirm deletion.
 * @param {Object} res - Express response object.
 * @returns {Object} Deletion confirmation message.
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { confirmPassword } = req.body;

    // Validate that confirm password is provided
    if (!confirmPassword) {
      return res.status(400).json({
        error: "You must provide your password to confirm deletion",
      });
    }

    // Get user (including password)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      confirmPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Incorrect password. Cannot delete account" });
    }

    // Get all diagrams of the user
    const diagrams = await Diagram.find({ userId });

    // Delete images associated with the diagrams
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
              console.error("Error deleting image:", err);
              // Continue deletion even if removing an image fails
            }
          }
        }
      }
    }

    // Delete all user's diagrams
    await Diagram.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    console.log(
      `✅ Account deleted: User ${user.username} (${user.email})`
    );

    res.json({
      message: "Your account and all your data have been permanently deleted",
      deletedUser: user.username,
      deletedDiagrams: diagrams.length,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
};
