import { getCurrencyCode, getOrders } from "@/lib/actions/actions";

import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { format } from "date-fns";
import ProductImage from "@/components/OrderImage";

const Orders = async () => {
  const { userId } = auth();
  const orders = await getOrders(userId as string);
  const currencyCode = await getCurrencyCode();

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {!orders ||
        (orders.length === 0 && (
          <p className="text-body-bold my-5">You have no orders yet.</p>
        ))}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div className="flex flex-col gap-8 p-4 hover:bg-grey-1">
            <div className="flex gap-20 max-md:flex-col max-md:gap-3 justify-between">
              <p className="text-base-bold">Order ID: {order.orderId}</p>
              <p className="text-base-bold">
                {format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a")}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div className="flex gap-4">
                  <ProductImage
                    src={orderItem.product.media[0]}
                    alt={orderItem.product.title}
                    productId={orderItem.product._id}
                  />
                  <div className="flex flex-col w-full">
                    <p className="text-small-medium">
                      <span className="text-small-bold">
                        <a href={`/products/${orderItem.product._id}`}>
                          {orderItem.product.title}
                        </a>
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

                    <p className="text-small-medium flex justify-end mt-auto">
                      <span className="text-[14px] font-[500] leading-[140%]">
                        {currencyCode[0].code}{" "}
                        {(orderItem.product.price * orderItem.quantity).toFixed(
                          2
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
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
