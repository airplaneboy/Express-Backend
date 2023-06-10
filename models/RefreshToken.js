const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
