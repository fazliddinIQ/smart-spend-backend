const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("🔥 REQUEST KELDI");
    console.log("BODY:", req.body);


    const { username, password } = req.body;
    console.log("USERNAME:", username);
    console.log("PASSWORD:", password);
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json(error);
    console.log(req.body);
  }


});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;