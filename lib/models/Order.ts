import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  orderId: String,
  name: {
    type: String,
    default: null,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      color: String,
      size: String,
      quantity: Number,
    },
  ],
  shippingAddress: {
    street: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    postalCode: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
  },
  shippingRate: String,
  totalAmount: Number,
  paymentMethod: String,
  status: {
    type: String,
    default: "pending",
  },
  phoneNo: {
    type: String,
    default: null,
  },
  attachment: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
