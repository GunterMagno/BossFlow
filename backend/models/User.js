const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
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
            message: 'EL email no es válido',
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
}, { timestamps: true });


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
        next();

    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', UserSchema);
module.exports = User;