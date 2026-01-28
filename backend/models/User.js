const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

/**
 * User schema with authentication, profile and statistics fields.
 * @typedef {Object} User
 * @property {string} username - Unique username (minimum 3 characters).
 * @property {string} email - Validated unique email.
 * @property {string} password - Hashed password (minimum 8 characters).
 * @property {string} avatar - Avatar URL (optional).
 * @property {string} bio - User biography (maximum 500 characters).
 * @property {Array<string>} favoriteGames - List of favourite games (maximum 10).
 * @property {Array<Object>} achievements - Unlocked achievements.
 * @property {Object} stats - User statistics.
 * @property {boolean} isVerified - Whether the email has been verified.
 * @property {string} verificationToken - Token to verify email.
 * @property {Date} verificationTokenExpires - Token expiry date.
 */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "The email is not valid",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxLength: 500,
      default: "",
    },
    favoriteGames: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: "You cannot have more than 10 favourite games",
      },
    },
    achievements: {
      type: [
        {
          name: String,
          description: String,
          icon: String,
          unlockedAt: Date,
        },
      ],
      default: [],
    },
    stats: {
      diagramsCreated: { type: Number, default: 0 },
      nodesCreated: { type: Number, default: 0 },
      collaborations: { type: Number, default: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook that hashes the password before saving.
 * @async
 * @private
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Method to compare the provided password with the stored hashed password.
 * @async
 * @param {string} password - Plain text password to compare.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
