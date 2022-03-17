const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 15,
    min: 2,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 50,
    min: 6,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  relationship: {
    type: Number,
    default: 1,
    enum: [1, 2, 3],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

UserSchema.set("timestamps", true);

module.exports = mongoose.model("User", UserSchema);
