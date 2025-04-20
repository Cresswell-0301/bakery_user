import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";

export const GET = async (req: NextRequest, { params }: { params: { clerkId: String } }) => {
    try {
        await connectToDB();

        const { clerkId } = params;
        const customer = await Customer.findOne({ clerkId });

        if (!customer) {
            return new NextResponse("Customer not found", { status: 404 });
        }

        return NextResponse.json({ loyaltyPoints: customer.loyaltyPoints || 0 }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
