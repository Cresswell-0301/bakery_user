import { connectToDB } from "@/lib/mongoDB";
import PaymentMethod from "@/lib/models/PaymentMethod";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();
    let paymentMethods = await PaymentMethod.find();

    paymentMethods.forEach((paymentMethod) => {
      paymentMethod.image = paymentMethod.image[0];
    });

    paymentMethods = paymentMethods.filter(
      (paymentMethod) => paymentMethod.active === true
    );

    return NextResponse.json(paymentMethods, { status: 200 });
  } catch (err) {
    console.log("[paymentMethods_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
