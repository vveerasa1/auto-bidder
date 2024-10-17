const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
  token_type: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  freelancerId: {
    type: Number,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v); // Basic URL validation for image formats
      },
      message: (props) => `${props.value} is not a valid image URL!`,
    },
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  tokenData: {
    type: tokenSchema,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
