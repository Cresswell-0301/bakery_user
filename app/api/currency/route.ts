import { connectToDB } from "@/lib/mongoDB";
import Currency from "@/lib/models/Currency";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    const currencies = await Currency.find().sort({ created: "desc" }).limit(1);
    return NextResponse.json(currencies, { status: 200 });
  } catch (err) {
    console.log("[currencies_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
