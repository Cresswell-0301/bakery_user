import { connectToDB } from "@/lib/mongoDB";
import RewardClaim from "@/lib/models/RewardClaim";
import { NextRequest, NextResponse } from "next/server";
import Reward from "@/lib/models/Reward";
import Customer from "@/lib/models/Customer";
import { auth } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { user_id, reward_id } = await req.json();
        const reward = await Reward.findById(reward_id);
        const customer = await Customer.findOne({ clerkId: user_id });

        if (!user_id) {
            return new NextResponse("Missing user_id", { status: 400 });
        }

        if (!reward_id) {
            return new NextResponse("Missing reward_id", { status: 400 });
        }

        if (!reward) {
            return new NextResponse("Reward not found", { status: 400 });
        }

        if (!customer) {
            return new NextResponse("Customer not found", { status: 400 });
        }

        if (reward.type !== "try_again") {
            reward.value -= 1;
            await reward.save();
        }

        if (reward.direct_claim) {
            const rewardTitle = reward.name;

            const match = rewardTitle.match(/[-+*]?\s*(\d+)/);

            const extractedPoints = match ? parseInt(match[1], 10) : 0;

            customer.loyaltyPoints += extractedPoints;

            await customer.save();
        }

        const newClaim = new RewardClaim({
            user_id,
            reward_id,
            status: reward.direct_claim ? "claimed" : "pending",
        });

        await newClaim.save();

        return NextResponse.json({ currentPoints: customer.loyaltyPoints }, { status: 201 });
    } catch (err) {
        console.error("[RewardClaim_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const claims = await RewardClaim.find({ user_id: userId }).sort({ claim_date: -1 }).lean();
        const rewardIds = claims.map((c) => c.reward_id);
        const rewards = await Reward.find({ _id: { $in: rewardIds } }).lean();

        const result = claims.map((claim) => ({
            ...claim,
            reward: rewards.find((r) => (r as any)._id.toString() === claim.reward_id.toString()),
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error("[MyClaims_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
