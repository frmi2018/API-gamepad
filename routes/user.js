const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Import du package cloudinary pour avatar
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");
const Game = require("../models/Game");

router.get("/user", (req, res) => {
  res.json({ message: "Welcome to the user route" });
});

router.post("/user/signup", async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.fields.email });
    if (userEmail) {
      res.status(400).json({ error: "This email is already used" });
    } else {
      const userUserName = await User.findOne({
        username: req.fields.username,
      });
      if (userUserName) {
        res.status(400).json({ error: "This username is already used" });
      } else {
        if (req.fields.username && req.fields.password && req.fields.email) {
          const salt = uid2(16);
          const hash = SHA256(req.fields.password + salt).toString(encBase64);
          const token = uid2(16);
          const newUser = new User({
            username: req.fields.username,
            email: req.fields.email,
            token: token,
            salt: salt,
            hash: hash,
          });

          // Avatar
          // if (req.files.picture.path) {
          //   // Envoi de l'image à cloudinary
          //   const result = await cloudinary.uploader.unsigned_upload(
          //     req.files.picture.path,
          //     "vinted_upload",
          //     {
          //       folder: `api/vinted/offers/${newOffer._id}`,
          //       public_id: "preview",
          //       cloud_name: "lereacteur",
          //     }
          //   );
          //   // ajout de l'image dans newUser
          //   newUser.avatar = result;
          // }

          await newUser.save();
          res.json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
            token: token,
          });
        } else {
          res.status(400).json({ error: "Missing parameters" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

router.post("/user/postreview", async (req, res) => {
  // console.log(
  //   req.fields.gameId,
  //   req.fields.title,
  //   req.fields.text,
  //   req.fields.author,
  //   Date.now()
  // );

  try {
    const game = await Game.findOne({ gameId: req.fields.gameId });

    if (game) {
      // res.status(400).json({ error: "existe" });
      game.review.push({
        title: req.fields.title,
        text: req.fields.text,
        author: req.fields.author,
        date: Date.now(),
      });
      await game.save();
      res.json({
        game,
      });
    } else {
      const game = new Game({
        gameId: req.fields.gameId,
        review: [
          {
            title: req.fields.title,
            text: req.fields.text,
            author: req.fields.author,
            date: Date.now(),
          },
        ],
      });
      await game.save();
      res.json({
        game,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/user/getreview", async (req, res) => {
  try {
    console.log(req.fields.gameId);
    const game = await Game.findOne({ gameId: req.fields.gameId });
    console.log(game);

    if (game) {
      let review = [];
      for (let i = 0; i < game.review.length; i++) {
        review.push({
          title: game.review[i].title,
          text: game.review[i].text,
          author: game.review[i].author,
          date: game.review[i].date,
        });
      }
      console.log(review);
      res.json({
        review,
      });
    } else {
      res.status(401).json({ error: "No review for this game" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
