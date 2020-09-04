const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
router.post(
  "/",
  [
    check("name", "Your name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    check("confirmPassword", "Passwords do not match!").custom(
      (value, { req, loc, path }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }
    ),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({
        errors: err.array(),
      });
    }
    const { name, email, password, confirmPassword } = req.body;
    try {
      let user = await User.findOne({
        email: email,
      });
      if (user)
        return res.status(401).json({
          msg: "User already exists",
        });
      user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 432000,
        },
        (err, token) => {
          if (err) throw err;
          res.json(token);
        }
      );
    } catch (err) {
      console.log(err);
      res.status(501).json(err);
    }
  }
);

module.exports = router;
