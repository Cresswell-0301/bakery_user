import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import IconImage from "@/lib/models/IconImage";

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const iconImages = await IconImage.find().limit(1);
        return NextResponse.json(iconImages, { status: 200 });
    } catch (err) {
        console.log("[iconImage_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
