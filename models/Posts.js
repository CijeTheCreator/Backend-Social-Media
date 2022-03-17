const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  postee: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
});

Post.set("timestamps", true);

module.exports = mongoose.model("Post", Post);
