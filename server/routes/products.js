const express = require("express");
const { ObjectId } = require("mongodb");
const verifyToken = require("../config/verifyToken");
const Product = require("../models/products.modal");
const app = express();

const checkDuplicateProduct = async (req, res, next) => {
  const { name, landingDate, manufacturedDate, expiryDate, units } = req.body;
  const existingProduct = await Product.findOne({
    name,
    landingDate,
    manufacturedDate,
    expiryDate,
    units,
  });

  if (existingProduct) {
    return res.status(409).json({
      message:
        "Product already exists please edit the stock details in the product list page",
    });
  }
  next();
};

app.post("/", verifyToken, checkDuplicateProduct, async (req, res) => {
  try {
    const product = new Product(req.body);
    product.userId = req?.user?._id;
    product.stockLeft = req.body.stock * req.body.units;
    product.stock = req.body.stock * req.body.units;
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving product" });
  }
});

app.get("/", verifyToken, async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          userId: new ObjectId(req?.user?._id),
          stockLeft: req?.query?.type === "HISTORY" ? { $lte: 0 } : { $gt: 0 },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$landingDate" } },
          products: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Oops! Something went wrong." });
  }
});

app.get("/all", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({
      userId: new ObjectId(req?.user?._id),
      expiryDate: { $gte: new Date() },
      stockLeft: { $gt: 0 },
      stock: { $gt: 0 },
    });
    res.send(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = app;
