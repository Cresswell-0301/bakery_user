import { connectToDB } from "@/lib/mongoDB";
import Intro from "@/lib/models/Intro";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const intro = await Intro.find().sort({ created: "desc" }).limit(1);
    return NextResponse.json(intro, { status: 200 });
  } catch (err) {
    console.log("[intro_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
