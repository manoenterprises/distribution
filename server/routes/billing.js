const express = require("express");
const { ObjectId } = require("mongodb");
const verifyToken = require("../config/verifyToken");
const app = express();
const Billing = require("../models/billing.modal");
const Product = require("../models/products.modal");

const stockUpdate = async (req, res) => {
  try {
    const billData = req.body;

    // update the product stockLeft count
    const updates = billData.products.map(({ productId, quantity }) => {
      return Product.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { stockLeft: -quantity } }
      );
    });

    await Promise.all(updates);

    res.send(req.result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
// Get all bills
app.get("/", async (req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single bill by id
app.get("/:id", getBill, (req, res) => {
  res.json(res.bill);
});

// Create a new bill
app.post(
  "/",
  verifyToken,
  async (req, res, next) => {
    const bill = new Billing({
      products: req.body.products,
      totalPrice: req.body.totalPrice,
      soldDate: req.body.soldDate,
      billNumber: req.body.billNumber,
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      customerAddress: req.body.customerAddress,
      payments: req.body.payments,
      userId: req.user._id,
    });

    try {
      const newBill = await bill.save();
      if (newBill) {
        req.result = newBill;
        next();
      }
      // res.status(201).json(newBill);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  stockUpdate
);

// Update a bill by id
app.patch("/:id", getBill, async (req, res) => {
  if (req.body.products != null) {
    res.bill.products = req.body.products;
  }
  if (req.body.totalPrice != null) {
    res.bill.totalPrice = req.body.totalPrice;
  }
  if (req.body.soldDate != null) {
    res.bill.soldDate = req.body.soldDate;
  }
  if (req.body.billNumber != null) {
    res.bill.billNumber = req.body.billNumber;
  }
  if (req.body.customerName != null) {
    res.bill.customerName = req.body.customerName;
  }
  if (req.body.customerPhone != null) {
    res.bill.customerPhone = req.body.customerPhone;
  }
  if (req.body.customerAddress != null) {
    res.bill.customerAddress = req.body.customerAddress;
  }
  if (req.body.paymentMethod != null) {
    res.bill.paymentMethod = req.body.paymentMethod;
  }
  if (req.body.userId != null) {
    res.bill.userId = req.body.userId;
  }

  try {
    const updatedBill = await res.bill.save();
    res.json(updatedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a bill by id
app.delete("/:id", getBill, async (req, res) => {
  try {
    await res.bill.remove();
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a bill by id
async function getBill(req, res, next) {
  try {
    const bill = await Billing.findById(req.params.id);
    if (bill == null) {
      return res.status(404).json({ message: "Cannot find bill" });
    }
    res.bill = bill;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = app;
