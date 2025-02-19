import mongoose from "mongoose";

const iconImageSchema = new mongoose.Schema({
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const IconImage = mongoose.models.IconImage || mongoose.model("IconImage", iconImageSchema);

export default IconImage;
