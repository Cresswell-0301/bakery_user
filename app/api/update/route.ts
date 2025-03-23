import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        await Customer.updateMany({ loyaltyPoints: { $exists: false } }, { $set: { loyaltyPoints: 0 } });
        return NextResponse.json("Success", { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
