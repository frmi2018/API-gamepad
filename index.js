// Package dotenv
require("dotenv").config();
// Package express
const express = require("express");
const app = express();
// Package express-formidable
const formidable = require("express-formidable");
app.use(formidable());
// Package Axios
const axios = require("axios");
// Package cors
const cors = require("cors");
app.use(cors());
// Package Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Routes
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.get("/games", async (req, res) => {
  const id = req.query.id;
  const page = req.query.page;
  const ordering = req.query.ordering;
  const page_size = req.query.pagesize;
  const search = req.query.search;

  try {
    if (id) {
      await axios
        .get(`https://api.rawg.io/api/games/${id}?key=${process.env.APIKEY}`)
        .then((response) => {
          const data = response.data;
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } else {
      if (search === undefined) {
        await axios
          .get(
            `https://api.rawg.io/api/games?key=${process.env.APIKEY}&page_size=${page_size}&page=${page}&ordering=${ordering}`
          )
          .then((response) => {
            const data = response.data;
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(400).json({ message: error.message });
          });
      } else {
        await axios
          .get(
            `https://api.rawg.io/api/games?key=${process.env.APIKEY}&page_size=${page_size}&page=${page}&search=${search}`
          )
          .then((response) => {
            const data = response.data;
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(400).json({ message: error.message });
          });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// -----

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Gamepad project" });
});

app.all("*", (req, res) => {
  res.status(404).send("Page not Found");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server has started, listening on ${port}`);
});
