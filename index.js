const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const port = 8000;
const app = express();
const User = require("./User");

mongoose.connect(
  "mongodb+srv://alejandronunez:10203041db@clusteralejandro.om3m4.mongodb.net/healthcareapp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection
  .once("open", () => {
    console.log("¡Connection was succesfully established with mongoose!");
  })
  .on("error", (error) => console.log(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(
  session({
    secret: "this code is completely secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (req.body.username === "" || req.body.password === "") {
      res.send("not having all fields filled, try again!");
    } else {
      if (err) throw err;
      if (!user) res.send("not existing in our database!");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send("authenticated with success!");
          console.log(req.user);
        });
      }
    }
  })(req, res, next);
});
app.post("/register", (req, res) => {
  if (
    req.body.firstname === "" ||
    req.body.lastname === "" ||
    req.body.username === "" ||
    req.body.acctype === "" ||
    req.body.password === ""
  ) {
    res.send("fields can't be empty!");
  } else {
    User.findOne({ username: req.body.username }, async (err, success) => {
      if (err) throw err;
      if (success) res.send("can't be created, this email already exists or fields are empty!");
      if (!success) {
        const hashPassword = await bcrypt.hash(req.body.password, 15);
        const addUser = new User({
          username: req.body.username,
          password: hashPassword,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          acctype: req.body.acctype,
        });
        await addUser.save();
        res.send("has been created!");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
