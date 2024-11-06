import { getCurrencyCode, getOrders } from "@/lib/actions/actions";

import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { format } from "date-fns";
import ProductImage from "@/components/OrderImage";

const Orders = async () => {
  const { userId } = auth();
  let orders = await getOrders(userId as string);
  const currencyCode = await getCurrencyCode();

  orders = orders?.sort(
    (a: OrderType, b: OrderType) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {!orders ||
        (orders.length === 0 && (
          <p className="text-body-bold my-5">You have no orders yet.</p>
        ))}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div
            key={order.orderId}
            className="flex flex-col gap-8 p-4 hover:bg-grey-1"
          >
            <div className="flex gap-20 max-md:flex-col max-md:gap-3 justify-between">
              <p className="text-base-bold">Order ID: {order.orderId}</p>
              <p className="text-base-bold">
                {format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a")}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div key={orderItem._id} className="flex gap-4">
                  <ProductImage
                    src={orderItem.product.media[0]}
                    alt={orderItem.product.title}
                    productId={orderItem.product._id}
                  />
                  <div className="flex flex-col w-full">
                    <p className="text-small-medium">
                      <span className="text-body-semibold">
                        <a href={`/products/${orderItem.product._id}`}>
                          {orderItem.product.title}
                        </a>
                      </span>
                    </p>
                    <p className="text-small-medium flex flex-row justify-between text-gray-400">
                      <span className="text-[14px] font-[500] leading-[140%]">
                        {orderItem.product.sizes}
                      </span>
                    </p>
                    <p className="text-small-medium flex flex-row justify-between">
                      <span className="text-[14px] font-[500] leading-[140%]">
                        {currencyCode[0].code}{" "}
                        {orderItem.product.price.toFixed(2)}
                      </span>

                      <span className="font-bold text-gray-500 text-[12px]">
                        x {orderItem.quantity}
                      </span>
                    </p>

                    <p className="text-small-medium flex mt-auto">
                      <span
                        className={`text-[14px] font-[500] leading-[140%] px-[5px] py-[0.5] rounded-full text-white 
                        ${
                          orderItem.status === "paid" ||
                          orderItem.status === "refund"
                            ? "bg-green-500"
                            : orderItem.status === "pending"
                            ? "bg-yellow-500"
                            : orderItem.status === "received_order"
                            ? "bg-black"
                            : orderItem.status === "preparing"
                            ? "bg-blue-500"
                            : orderItem.status === "delivery"
                            ? "bg-orange-400"
                            : orderItem.status === "done"
                            ? "bg-grey-2"
                            : "bg-red-500"
                        }`}
                      >
                        {orderItem.status === "received_order"
                          ? "Order Received"
                          : orderItem.status.charAt(0).toUpperCase() +
                            orderItem.status.slice(1)}
                      </span>

                      <span className="text-[14px] font-[500] leading-[140%] ml-auto">
                        {currencyCode[0].code}{" "}
                        {(orderItem.product.price * orderItem.quantity).toFixed(
                          2
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
              {order.remarks && (
                <p className="text-small-medium">
                  <span className="text-small-bold">Remarks:</span>{" "}
                  {order.remarks}
                </p>
              )}
              <p className="text-base-bold text-right">
                Total{" "}
                {order.products.reduce(
                  (acc: number, item: OrderItemType) => acc + item.quantity,
                  0
                )}{" "}
                Items: {currencyCode[0].code} {order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

export const dynamic = "force-dynamic";
