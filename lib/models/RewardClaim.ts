import mongoose from "mongoose";

const RewardClaimSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    reward_id: {
        type: String,
        required: true,
    },
    claim_date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "claimed", "expired"],
        default: "claimed",
    },
});

const RewardClaim = mongoose.models.RewardClaim || mongoose.model("RewardClaim", RewardClaimSchema);

export default RewardClaim;
