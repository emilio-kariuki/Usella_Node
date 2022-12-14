const mongoose = require("mongoose");
const express = require("express");
const userModel = require("../Models/user");

const router = express.Router();

router.get("/name/:name", getName, async (req, res) => {
  res.send(req.user);
});

router.get("/email/:email", getEmail, async (req, res) => {
  res.send(req.user.email);
});

router.get("/id/:id", getUser, async (req, res) => {
  res.send(req.user);
});

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
});

router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name) {
    req.user.name = req.body.name;
  }
  if (req.body.email) {
    req.user.email = req.body.email;
  }
  if (req.body.password) {
    req.user.password = req.body.password;
  }

  try {
    await req.user.save();
    res.status(200).json({ message: "user updated successfully" });
  } catch (e) {
    res.status(400).json({ message: "Could not update user" });
  }
});

async function getEmail(req, res, next) {
  const { email } = req.params;
  let user;
  try {
    user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
  req.user = user;
  next();
}

async function getName(req, res, next) {
  const { name } = req.params;
  let user;
  try {
    user = await userModel.findOne({ name: name });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
  req.user = user;
  next();
}
router.post("/", async (req, res) => {
  if (
    !req.body.email.includes("@") ||
    !req.body.email.includes(".") ||
    req.body.password.length < 7
  ) {
    res
      .status(422)
      .json({ message: "Invalid email and password must be > 7 characters " });
  } else {
    try {
      const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      await newUser
        .save()
        .then(() => {
          res.status(200).json({ message: "new user has been added" });
        })
        .catch(() => {
          res.status(500).json({ message: "Server error" });
        });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
});


async function getUser(req, res, next) {
  let user;
  try {
    user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
  req.user = user;
  next();
}

module.exports = router;
