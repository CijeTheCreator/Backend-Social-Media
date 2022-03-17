const express = require("express");
const Post = require("./../models/Posts");
const mongoose = require("mongoose");
const User = require("./../models/User");

const router = express.Router();

//Create Post
router.post("/createPost/:id", (req, res) => {
  if (req.body.id === req.params.id) {
    const post = new Post({
      postee: req.body.id,
      description: req.body.description,
    });
    post.save((err, doc) => {
      if (err) {
        res.status(500).send("This Post Couldn't be created");
      } else {
        res.status(200).json(doc);
      }
    });
  } else {
    res
      .status(500)
      .send(
        "You cannot create post as this user as you are not logged in as the user"
      );
  }
});

//Delete Post
router.delete("/deletePost/:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      req.status(500).send("Error Validating User: Couldn't find User");
    } else {
      if (req.params.id === req.body.id || doc.isAdmin) {
      } else {
        res
          .status(500)
          .send(
            "You cannot delete this post as you are not the user that posted it"
          );
      }
    }
  });
});

//Edit Post
router.put("/editPost/:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(500).send("There was an error validating this user");
    } else {
      if (req.params.id === req.body.id) {
        Post.findByIdAndUpdate(req.body.postID, req.body.post, (err, doc) => {
          if (err) {
            res
              .status(500)
              .send("The user was validated but the post could not be sent");
          } else {
            res.status(200).json(doc);
            console.log("The post was updated");
          }
        });
      } else {
        res
          .status(500)
          .send(
            "You cannot edit this post as you are not the user that posted it"
          );
      }
    }
  });
});

//Get Post
router.get("/getPost/:id", (req, res) => {
  Post.findById(req.body.id, (err, doc) => {
    if (err) {
      res.status(500).send("There was an error locating the post");
    } else {
      res.status(200).json(doc);
    }
  });
});

//Get Timeline Posts
router.get("/getTimelinePosts/:id", async (req, res) => {
  try {
    let timelinePosts = [];
    const currentUserPosts = await Post.find({ postee: req.params.id });
    const currentUser = await User.find({ _id: req.params.id });

    if (currentUser) {
      const currentUserFriends = await currentUser[0].following;
      const friendsPosts = currentUserFriends.map((friendID) => {
        return Post.find({ postee: friendID });
      });
      const followingPosts = await Promise.all(friendsPosts);
      timelinePosts = [...currentUserPosts, ...followingPosts.flat(4)];
      res.status(200).json(timelinePosts);
    } else {
      res
        .status(500)
        .send("Something went wrong while trying to find current user");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Get all Posts from a certain User
router.get("/userPosts/:id", async (req, res) => {
  const userPosts = await Post.find({ postee: req.params.id });
  res.status(200).json(userPosts);
});
module.exports = router;
