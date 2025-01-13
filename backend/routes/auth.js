const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing and comparing passwords
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Serve the signup page
router.get('/signup', (req, res) => {
  res.send('signup page');
  console.log('signup page');
});

// Serve the login page
router.get('/login', (req, res) => {
  res.send('login page');

});

// Signup Route - Hash the password before saving
router.post("/signup", async (req, res) => {
  const { pin, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ pin, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login Route - Compare the entered password with the hashed password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User Not Found" }); // Unified error message
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;