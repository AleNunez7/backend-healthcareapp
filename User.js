const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  acctype: String,
});

module.exports = mongoose.model("User", user);
