const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User.model");
const { verifyToken } = require("../middleware/auth.middleware");

// POST "api/auth/signup"

router.post("/signup", async (req, res, next) => {
  const { email, password, name, profilePicture } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Please fill the email and password" });
    return;
  }
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res
      .status(400)
      .json({
        errorMessage:
          "The password is not match the requirement. You needs at least 8 characters, 1 uppercase, 1 lowercase and 1 number",
      });
    return;
  }
  // email has a valid structure

  try {
    // email should be unique
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      res
        .status(400)
        .json({
          errorMessage:
            "It looks like you already have an account with this email",
        });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email: email,
      password: hashedPassword,
      name: name,
      ...(profilePicture && { profilePicture }),
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// POST "api/auth/login"

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Please fill your email and password" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "This account is not exist" });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!passwordCorrect) {
      res.status(400).json({ errorMessage: "Invalid password" });
      return;
    }
    
    // generate the Token JWT
    const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        
        //todo if we had roles, we would need to add the role of the user
    };
    
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: "7d",
    });
    
    res.status(200).json({ authToken, payload });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => received the token, and validates it and will send to the FE who the owner of the token it.
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json(req.payload);
});

//GET "api/auth/verify" => recived the token and validates it

module.exports = router;
