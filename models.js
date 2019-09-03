'use strict';
//require the ORM layer here
const mongoose = require("mongoose");

//schema to represent a user
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  link: { type: String, required: true },
  joined: {type: String, required: true},
  status: {type: String, required: true}
});

userSchema.methods.serialize = function() {
  return {
   name: this.name,
   location: this.location,
   link: this.link,
   joined: this.joined,
   status: this.status
  }
}

//schema to represent a tweet
const tweetSchema = mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date }
});

tweetSchema.methods.serialize = function() {
  return {
    id: this.id,
    name: this.name,
    text: this.text,
    date: this.date
  }
}

const User = mongoose.model("users_collections", userSchema);
const Tweet = mongoose.model('tweets_collections', tweetSchema);

module.exports = { Tweet, User };


