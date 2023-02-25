const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          index: true,
        },
        quantity: { type: Number, index: true },
      },
    ],
    totalPrice: { type: Number, index: true },
    soldDate: { type: Date, index: true },
    billNumber: { type: String, index: true },
    customerName: { type: String, index: true },
    customerPhone: { type: String, index: true },
    customerAddress: { type: String, index: true },
    payments: [
      {
        amount: { type: Number, index: true },
        method: { type: String, default: "CASH", index: true },
      },
    ],
    comments: { type: String },
    dueAmount: { type: Number, index: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
