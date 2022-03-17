const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

dotenv.config();

//Create Users
router.put("/register", async (req, res) => {
  console.log("Registration Started");
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;

  const salt = await bcrypt.genSalt(10);
  console.log("salt", salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashedPassword", hashedPassword);
  const MONGO_URL = process.env.MONGO_URL;
  const db = mongoose.createConnection(MONGO_URL);
  console.log("db Connected");
  db.on("error", console.error.bind(console, "connection error:"));
  console.log("was db.onceOpen fired");
  db.once("open", () => {
    console.log("Connection to MongoDB server successful");
    const newUser = new UserModel({
      name: name,
      username: username,
      password: hashedPassword,
      email: email,
    });
    newUser.save((err, user) => {
      err && console.log(err);
      console.log("Saved to Collection");
      res.status(200).json(user);
    });
    console.log("Yes it was");
  });
});

//Logining in Users
router.post("/login", async (req, res) => {
  const MONGO_URL = process.env.MONGO_URL;
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  res.setHeader("Access-Control-Allow-Origin", "*");

  const user = await UserModel.findOne({ email: req.body.email });
  !user && res.status(404).send("This User does not Exist");

  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (validatePassword) {
    res.status(200).json(user);
  } else {
    res.status(400).send("This Password is not correct");
  }
});

module.exports = router;
