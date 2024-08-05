import { connectToDB } from "@/lib/mongoDB";
import Currency from "@/lib/models/Currency";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { currencyId: String } }
) => {
  try {
    await connectToDB();
    const currency = await Currency.findById(params.currencyId);

    if (!currency) {
      return NextResponse.json(
        { message: "Currency not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currency, { status: 200 });
  } catch (err) {
    console.log("[currencyId_GET]", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
