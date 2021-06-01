const mongoose = require("mongoose");

const Game = mongoose.model("Game", {
  gameId: {
    required: true,
    unique: true,
    type: String,
  },
  review: [
    {
      title: String,
      text: String,
      author: { type: "ObjectId", ref: "User" },
      date: Date,
    },
  ],
});

module.exports = Game;
