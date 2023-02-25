const express = require("express");
const User = require("../models/users.modal");
const app = express();
const authentication = require("./authentication");
const products = require("./products");
const billing = require("./billing");
const { hashPassword } = require("../config/passwordUtils");

app.post("/user", async (req, res) => {
  const newUser = new User(req.body);
  // let response = newUser.save(newUser);

  hashPassword(newUser.password)
    .then(async (hash) => {
      newUser.password = hash;
      await newUser.save();
    })
    .then((savedUser) => {
      console.log("User saved:", savedUser);
      res.send({ success: true });
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      res.status(500).send({ success: false });
    });
  // res.send(response);
});

app.use("/authentication", authentication);
app.use("/products", products);
app.use("/billing", billing);
app.use("/sales", billing);

module.exports = app;
