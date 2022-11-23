const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,

  },
  username: {
    type: String,
    required: true,

    unique: true,
  },
  resetToken: {
    type: String,

    default: null,
  },
  score: {
    type: Number,
    max: 3,
  },
  team: {
    type: String,
    required: true,

  }
});

module.exports = mongoose.model('User', UserSchema)
