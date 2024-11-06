import mongoose from "mongoose";

const IntroSchema = new mongoose.Schema({
  description: String,
});

const Intro = mongoose.models.Intro || mongoose.model("Intro", IntroSchema);

export default Intro;
