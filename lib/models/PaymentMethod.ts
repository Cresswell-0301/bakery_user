import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema({
  name: String,
  image: [String],
  active: { type: Boolean, default: true },
});

const PaymentMethod =
  mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", PaymentMethodSchema);

export default PaymentMethod;
