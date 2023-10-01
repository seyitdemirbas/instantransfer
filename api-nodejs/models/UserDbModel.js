const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String, trim: true, index: {
      unique: true,
      partialFilterExpression: {email: {$type: "string"}}
    }
  },
  password: { type: String },
  isanon: {type: String, default: false},
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);