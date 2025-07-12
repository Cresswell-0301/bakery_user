import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { user_id, pointsToDeduct } = await req.json();

        if (!user_id || !pointsToDeduct) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        const customer = await Customer.findOne({ clerkId: user_id });

        if (!customer) {
            return NextResponse.json({ message: "Customer not found" }, { status: 404 });
        }

        if (customer.loyaltyPoints < pointsToDeduct) {
            return NextResponse.json({ message: "Not enough points" }, { status: 400 });
        }

        customer.loyaltyPoints -= pointsToDeduct;
        await customer.save();

        return NextResponse.json({ message: "Points deducted successfully", currentPoints: customer.loyaltyPoints }, { status: 200 });
    } catch (error) {
        console.error("[DEDUCT_POINTS]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};

export const dynamic = "force-dynamic";
