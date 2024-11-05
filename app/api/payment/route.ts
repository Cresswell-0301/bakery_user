import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const requestData = await req.json();

    const { cart, customer, sumAmount, ...formValues } = requestData;

    // Prepare customer and order information
    const customerInfo = {
      clerkId: customer.clerkId || null,
      name: customer.name || "",
      email: customer.email || "",
    };

    // Prepare order items
    const orderItems = cart.map((item: any, index: number) => ({
      product: formValues.products[index].productId,
      quantity: item.quantity,
      color: "N/A",
      size: "N/A",
    }));

    // Prepare Shipping Address
    const shippingAddress = {
      street: formValues.ShippingAddress.address || "",
      city: formValues.ShippingAddress.city || "",
      state: formValues.ShippingAddress.state || "",
      postalCode: formValues.ShippingAddress.postalCode || "",
      country: formValues.ShippingAddress.country || "Malaysia",
    };

    await connectToDB();

    // Create new order
    const newOrder = new Order({
      customerClerkId: customerInfo.clerkId,
      orderId: await generateOrderId(),
      name: formValues.name,
      products: orderItems,
      totalAmount: sumAmount,
      paymentMethod: formValues.paymentMethod,
      shippingAddress: shippingAddress,
      status: "pending",
      phoneNo: formValues.phoneNo,
      attachment: formValues.attachment,
      remarks: formValues.remarks,
      createdAt: new Date(
        new Date().getTime() + 8 * 60 * 60 * 1000
      ).toISOString(),
    });

    await newOrder.save();

    console.log("[Order created]", newOrder);

    let foundCustomer = await Customer.findOne({
      clerkId: customerInfo.clerkId,
    });

    if (foundCustomer) {
      foundCustomer.orders.push(newOrder._id);
    } else {
      foundCustomer = new Customer({
        ...customerInfo,
        orders: [newOrder._id],
      });
    }

    await foundCustomer.save();

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.log("[payment_POST]", err);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};

const generateOrderId = async () => {
  const orderCount = await Order.countDocuments();
  const newSequenceNumber = orderCount + 1;
  return `ORD-${newSequenceNumber.toString().padStart(5, "0")}`;
};
