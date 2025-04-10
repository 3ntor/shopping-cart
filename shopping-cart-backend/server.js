require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); //

const app = express();
app.use(express.json());
app.use(cors()); //

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Define Cart Item Schema
const CartItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number
});

const CartItem = mongoose.model("CartItem", CartItemSchema);

// Routes
app.get("/cart", async (req, res) => {
  const items = await CartItem.find();
  res.json(items);
});

app.post("/cart", async (req, res) => {
  const newItem = new CartItem(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put("/cart/:id", async (req, res) => {
  const updatedItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

app.delete("/cart/:id", async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
});
// Start Server
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
