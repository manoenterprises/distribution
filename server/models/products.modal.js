const mongoose = require("mongoose");

// Define the schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, index: true },
    stock: { type: Number, index: true },
    stockLeft: { type: Number, index: true },
    landingDate: { type: Date, index: true },
    expiryDate: { type: Date, index: true },
    manufacturedDate: { type: Date, index: true },
    pack: { type: Number },
    units: { type: Number },
    mrp: { type: Number },
    billingPriceRetail: { type: Number },
    schemeAmount: { type: Number },
    netPrice: { type: Number },
    retailPriceBottle: { type: Number },
    marginPerBottle: { type: Number },
    particulars: { type: String },
    unitOfMeasure: { type: String, default: "ML" },
    createdAt: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create the model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
