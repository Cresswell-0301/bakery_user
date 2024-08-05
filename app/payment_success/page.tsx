"use client";

import Loader from "@/components/Loader";
import useCart from "@/lib/hooks/useCart";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SuccessfulPayment = () => {
  const cart = useCart();
  const [seconds, setSeconds] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cart.clearCart();

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          setLoading(true);
        }
        return prevSeconds - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <span>
            <CircleCheckBig color="#37b800" />
          </span>
          <p className="text-heading4-bold text-[#37b800]">
            Order has been placed successfully
          </p>
          <p>Thank you for your support</p>
          <Link
            href="/"
            className={`p-4 border text-base-bold ${
              seconds <= 1
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            CONTINUE TO SHOPPING ({seconds} seconds)
          </Link>
        </>
      )}
    </div>
  );
};

export default SuccessfulPayment;
