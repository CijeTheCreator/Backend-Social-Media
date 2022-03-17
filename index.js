const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const auth = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.use(morgan("common"));
app.use(helmet());
app.use(express.json());
app.use("/v1/api/", auth);
app.use("/v1/api/users/", userRouter);
app.use("/v1/api/posts/", postRouter);

app.listen(8080, () => {
  console.log("Backend Server is online and ready to take requests");
});
