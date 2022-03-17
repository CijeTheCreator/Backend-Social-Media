const express = require("express");
const User = require("./../models/User");
const router = express.Router();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

dotenv.config();

//Update
router.put("/:id", async (req, res) => {
  User.findById(req.params.id, async (err, user) => {
    if (err) {
      res.send("There was an error, the specified ID is probably incorrect");
    } else {
      if (req.params.id === req.body._id || user.isAdmin) {
        if (req.body.password) {
          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          req.body.password = hashedPassword;
        }
        User.findByIdAndUpdate(
          req.body._id,
          { $set: req.body },
          (err, docs) => {
            if (err) {
              console.log(err);
              res.send("Update Failed");
            } else {
              res.status(200).json(docs);
            }
          }
        );
      } else {
        res
          .status(500)
          .send(
            "You cannot edit this users details as you are not the user and you are not an admin"
          );
      }
    }
  });
});

//Delete
router.delete("/:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      res
        .status(500)
        .send(
          "Error: This error was thrown because the user sending this request does not exist"
        );
    } else {
      if (req.params.id === req.body.id || doc.isAdmin) {
        User.findByIdAndDelete(req.body.id, (err, doc) => {
          if (err) {
            res
              .status(500)
              .send(
                "The User was validated, but there was an internal error while deleting this user"
              );
          } else {
            res.status(200).send("This User has been deleted");
          }
        });
      } else {
        res
          .status(500)
          .send(
            "Error: You cannot delete this user because you are not the user either because you are not the user or you are not an admin"
          );
      }
    }
  });
});

//Get User
router.get("/", async (req, res) => {
  const username = req.query.username;
  const id = req.query.id;

  if (username) {
    const user = await User.findOne({ username: username });
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(user);
  } else if (id) {
    const user = await User.findById(id);
    res.status(200).json(user);
  } else {
    res.status(400).send("Invalid query provided");
  }
});

//Get All Users
router.get("/getAllUsers/get", async (req, res) => {
  const Users = await User.find();
  res.status(200).json(Users);
});

//Follow
router.post("/follow/:id", async (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(500).send("Couldn't Find Current User");
    } else {
      const currentUser = doc;
      User.findById(req.body.id, (err, ToBeFollowedDoc) => {
        if (err) {
          res.status(500).send("Couldn't Find User to Follow");
        } else {
          if (req.params.id === req.body.id) {
            res.status(500).send("You cannot follow yourself");
          } else {
            console.log(ToBeFollowedDoc);
            console.log(currentUser);
            if (
              !currentUser.following.includes(req.body.id) &&
              !ToBeFollowedDoc.followers.includes(req.params.id)
            ) {
              User.findByIdAndUpdate(
                req.params.id,
                {
                  $push: { following: req.body.id },
                },
                (err, doc) => {
                  if (err) {
                    res
                      .status(500)
                      .send("Something went wrong while following the user");
                  } else {
                    console.log("Followed");
                  }
                }
              );
              User.findByIdAndUpdate(
                req.body.id,
                {
                  $push: { followers: req.params.id },
                },
                (err, doc) => {
                  if (err) {
                    res
                      .status(500)
                      .send("Something went wrong while following the user");
                  } else {
                    res.status(200).json(doc);
                  }
                }
              );
            } else {
              res.status(500).send("You are already following this user");
            }
          }
        }
      });
    }
  });
});

//Unfollow
router.post("/unfollow/:id", (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(500).send("Couldn't Find Current User");
    } else {
      const currentUser = doc;
      User.findById(req.body.id, (err, ToBeFollowedDoc) => {
        if (err) {
          res.status(500).send("Couldn't Find User to Follow");
        } else {
          if (req.params.id === req.body.id) {
            res.status(500).send("You cannot unfollow yourself");
          } else {
            console.log(currentUser);
            console.log(ToBeFollowedDoc);
            if (
              currentUser.following.includes(req.body.id) &&
              ToBeFollowedDoc.followers.includes(req.params.id)
            ) {
              User.findByIdAndUpdate(
                req.params.id,
                {
                  $pull: { following: req.body.id },
                },
                (err, doc) => {
                  if (err) {
                    res
                      .status(500)
                      .send("Something went wrong while following the user");
                  } else {
                    console.log("Followed");
                  }
                }
              );
              User.findByIdAndUpdate(
                req.body.id,
                {
                  $pull: { followers: req.params.id },
                },
                (err, doc) => {
                  if (err) {
                    res
                      .status(500)
                      .send("Something went wrong while following the user");
                  } else {
                    res.status(200).json(doc);
                  }
                }
              );
            } else {
              res.status(500).send("You are not following this user");
            }
          }
        }
      });
    }
  });
});
module.exports = router;
