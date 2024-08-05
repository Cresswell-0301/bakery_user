"use client";

import Loader from "@/components/Loader";
import useCart from "@/lib/hooks/useCart";
import useCurrencyCode from "@/lib/hooks/useCurrencyCode";
import usePaymentMethod from "@/lib/hooks/usePaymentMethod";

import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const currencyCode = useCurrencyCode();
  const [selectPayment, setSelectPayment] = useState("");
  const paymentMethod: PaymentMethodType[] = usePaymentMethod();

  useEffect(() => {
    if (currencyCode && paymentMethod) {
      setLoading(false);
    }
  }, [currencyCode, paymentMethod]);

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        router.push("sign-in");
      } else {
        const methodRecord = paymentMethod.find(
          (method) => method.name == selectPayment
        );

        if (!methodRecord) {
          toast.error("Please select a valid payment method");
          return;
        }

        if (selectPayment) {
          toast.success("Proceed to checkout");

          if (selectPayment == "Stripe") {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
              {
                method: "POST",
                body: JSON.stringify({ cartItems: cart.cartItems, customer }),
              }
            );
            const data = await res.json();
            window.location.href = data.url;
          } else {
            const url = `/payment?cart=${encodeURIComponent(
              JSON.stringify(cart.cartItems)
            )}&customer=${encodeURIComponent(
              JSON.stringify(customer)
            )}&paymentMethod=${encodeURIComponent(
              JSON.stringify(methodRecord)
            )}`;
            router.push(url);
          }
        } else {
          toast.error("Please select a payment method");
        }
      }
    } catch (err) {
      console.log("[checkout_POST]", err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
              >
                <div className="flex items-center w-[70%]">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">
                      {currencyCode} {cartItem.item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "items" : "item"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>
            {currencyCode} {totalRounded.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-body-semibold">Payment Method</label>
          <select
            className="border rounded-lg py-2 px-3"
            value={selectPayment}
            onChange={(e) => setSelectPayment(e.target.value)}
          >
            <option value="">Select payment method</option>
            {paymentMethod.map((method) => (
              <option key={method._id} value={method.name}>
                {method.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Cart;
