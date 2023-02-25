const mongoose = require("mongoose");
const uri = encodeURI(
  "mongodb+srv://manoenterprises16:M4bfea0SDPdWu2go@distribution.fnenvjk.mongodb.net/?retryWrites=true&w=majority"
);

async function connectDB() {
  return await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      dbName: "distributionDB",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("Error connecting to database:", error.message);
    });
}
module.exports = connectDB;
