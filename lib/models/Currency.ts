import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema({
  code: String,
});

const Currency =
  mongoose.models.Currency || mongoose.model("Currency", CurrencySchema);

export default Currency;
