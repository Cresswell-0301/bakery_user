import { connectToDB } from "@/lib/mongoDB";
import Banner from "@/lib/models/Banner";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const banners = await Banner.find().limit(1);
    return NextResponse.json(banners, { status: 200 });
  } catch (err) {
    console.log("[banners_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
