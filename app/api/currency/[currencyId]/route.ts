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
      return { status: 404, body: { message: "Currency Not Found" } };
    }

    return NextResponse.json(currency, { status: 200 });
  } catch (err) {
    console.log("[currencyId_GET]", err);
    return { status: 500, body: "Internal Server Error" };
  }
};

export const dynamic = "force-dynamic";
