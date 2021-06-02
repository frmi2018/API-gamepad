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
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: Date.now,
    },
  ],
});

module.exports = Game;
