const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);