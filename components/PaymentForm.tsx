"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import useCurrencyCode from "@/lib/hooks/useCurrencyCode";

const formSchema = z.object({
  name: z.string(),
  products: z.array(
    z.object({
      productName: z.string(),
      productId: z.string(),
      quantity: z.number(),
      price: z.number(),
      totalPrice: z.number(),
    })
  ),
  paymentMethod: z.string(),
  paymentMethodImage: z.string(),
  ShippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  phoneNo: z.string(),
  attachment: z.string(),
  remarks: z.string(),
  createdAt: z.string(),
  termsAccepted: z.boolean(),
});

interface PaymentFormProps {
  cart: any[];
  customer: any;
  method: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  cart,
  customer,
  method,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currencyCode = useCurrencyCode();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime < 1) {
          clearInterval(timer);
          toast.dismiss();
          toast.error("Payment session expired !");
          setTimeout(() => {
            router.push("/cart");
          }, 500);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const sumQty = cart.reduce((acc, item) => acc + item.quantity, 0);

  const sumAmount = cart.reduce(
    (acc, item) => acc + item.item.price * item.quantity,
    0
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      products: cart.map((item) => ({
        productName: item.item.title || "",
        productId: item.item.id || "",
        quantity: item.quantity || 0,
        price: item.item.price || 0,
        totalPrice: item.item.price * item.quantity,
      })),
      paymentMethod: method?.name || "",
      paymentMethodImage: method?.image?.[0] || "",
      ShippingAddress: {
        address: "",
        city: "",
        state: "",
        zip: "",
      },
      phoneNo: "",
      attachment: "",
      remarks: "",
      createdAt: "",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const combinedData = {
        cart,
        customer,
        sumAmount,
        ...values,
      };
      const res = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify(combinedData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast.success("Order placed successfully !");
        router.push("/payment_success");
      }
    } catch (err) {
      setLoading(false);
      console.log("[paymentForm_POST]", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-center py-3 bg-blue-100">
          Secure Payment
        </h1>
        <div className="flex justify-end pr-2">
          <span className="text-gray-500 font-semibold">
            Time Left: {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side */}
          <div className="md:w-1/2 bg-gray-50 p-8 pt-2">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <div>
                    <p className="font-semibold" style={{ whiteSpace: 'pre-line' }}>{item.item.title}</p>
                    <p className="text-sm text-gray-600">
                      {currencyCode} {item.item.price.toFixed(2)} x{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {currencyCode}{" "}
                    {(item.item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-gray-200">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total {sumQty} item:</span>
                <span>
                  {currencyCode} {sumAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {method?.name != "Cash On Delivery" && (
              <>
                <div className="mt-8 flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4">
                    Scan QR Code to Pay
                  </h3>
                  <div className="bg-white p-2 inline-block rounded-lg shadow-md">
                    <img
                      src={form.watch("paymentMethodImage")}
                      alt="QR Code for Payment"
                      className="w-48 h-48 rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-5">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Scan the QR code to pay, then submit the form to confirm
                        your order.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 p-8 pt-2">
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <form
              className="space-y-6"
              id="payment-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="Name"
                >
                  Name
                </label>
                <input
                  {...form.register("name")}
                  placeholder="Name"
                  onKeyDown={handleKeyPress}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="phone"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...form.register("phoneNo")}
                  placeholder="Phone Number"
                  onKeyDown={handleKeyPress}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="shippingAddress.address"
                >
                  Street Address / Class
                </label>
                <input
                  {...form.register("ShippingAddress.address")}
                  placeholder="Address"
                  onKeyDown={handleKeyPress}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="shippingAddress.city"
                  >
                    City
                  </label>
                  <input
                    {...form.register("ShippingAddress.city")}
                    placeholder="City"
                    onKeyDown={handleKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="shippingAddress.state"
                  >
                    State
                  </label>
                  <input
                    {...form.register("ShippingAddress.state")}
                    placeholder="State"
                    onKeyDown={handleKeyPress}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="shippingAddress.zip"
                >
                  Postal Code
                </label>
                <input
                  {...form.register("ShippingAddress.zip")}
                  placeholder="Postal Code"
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="Remarks"
                >
                  Remarks
                </label>
                <input
                  {...form.register("remarks")}
                  placeholder="Remarks"
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="attachment"
                >
                  Attachment (if required)
                </label>
                <input
                  type="file"
                  {...form.register("attachment")}
                  placeholder="Attach File"
                  onKeyDown={handleKeyPress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...form.register("termsAccepted")}
                  id="terms"
                  required
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I accept the{" "}
                  <a
                    href="/terms-n-conditions"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    terms and conditions
                  </a>
                </label>
              </div>

              <div className="flex justify-between items-center mt-8">
                <a
                  onClick={() => router.push("/")}
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                >
                  <i className="fas fa-chevron-left mr-1"></i>
                  Cancel
                </a>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
