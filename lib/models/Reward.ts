import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    change_weight: {
        type: Number,
        required: true,
    },
    direct_claim: {
        type: Boolean,
        default: false,
    },
    is_active: {
        type: Boolean,
        default: true,
    },
});

const Reward = mongoose.models.Reward || mongoose.model("Reward", RewardSchema);

export default Reward;
