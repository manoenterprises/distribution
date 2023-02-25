const { hashPassword } = require("../config/passwordUtils");
const User = require("../models/users.modal");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.post("/", function (req, res) {
  try {
    const distributionCode = req.body.distributionCode;
    const password = req.body.password;
    User.findOne(
      { distributionCode: distributionCode },
      async function (err, user) {
        if (err) throw err;
        if (!user) {
          res
            .status(401)
            .json({ message: "Authentication failed. User not found." });
        } else {
          const isMatch = await bcrypt.compare(password, user?.password);
          if (isMatch) {
            // Passwords match
            // Return a JWT token
            const token = jwt.sign(
              { distributionCode: user.distributionCode, _id: user._id },
              process.env.JWT_SECRET
            );
            res.status(200).json({
              message: "Authentication successful",
              token: token,
            });
          } else {
            res.status(401).json({
              message: "Authentication failed. Passwords did not match.",
            });
          }
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

module.exports = app;
