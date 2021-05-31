const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Import du package cloudinary
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");

router.get("/user", (req, res) => {
  res.json({ message: "Welcome to the user route" });
});

router.post("/user/signup", async (req, res) => {
  console.log(req.fields.email, req.fields.username);
  try {
    // Je vérifie que l'email ne soit pas utilisé !
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
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

module.exports = router;
