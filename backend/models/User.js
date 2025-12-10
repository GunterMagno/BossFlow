const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

/**
 * Esquema de usuario con campos de autenticación, perfil y estadísticas.
 * @typedef {Object} User
 * @property {string} username - Nombre de usuario único (mínimo 3 caracteres).
 * @property {string} email - Email único validado.
 * @property {string} password - Contraseña hasheada (mínimo 8 caracteres).
 * @property {string} avatar - URL del avatar (opcional).
 * @property {string} bio - Biografía del usuario (máximo 500 caracteres).
 * @property {Array<string>} favoriteGames - Lista de juegos favoritos (máximo 10).
 * @property {Array<Object>} achievements - Logros desbloqueados.
 * @property {Object} stats - Estadísticas del usuario.
 * @property {boolean} isVerified - Si el email ha sido verificado.
 * @property {string} verificationToken - Token para verificar email.
 * @property {Date} verificationTokenExpires - Fecha de expiración del token.
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
        message: "EL email no es válido",
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
        message: "No puedes tener más de 10 juegos favoritos",
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
 * Hook de pre-guardado que hashea la contraseña antes de guardar.
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
 * Método para comparar la contraseña ingresada con la contraseña hasheada almacenada.
 * @async
 * @param {string} password - Contraseña en texto plano a comparar.
 * @returns {Promise<boolean>} True si las contraseñas coinciden, false en caso contrario.
 */
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
