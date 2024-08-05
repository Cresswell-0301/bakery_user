"use client";

import Loader from "@/components/Loader";
import PaymentForm from "@/components/PaymentForm";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({});
  const [method, setMethod] = useState("");

  if (typeof window !== "undefined" && !window.location.search) {
    window.location.href = "/cart";
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const cartData = url.searchParams.get("cart");
    const customerData = url.searchParams.get("customer");
    const paymentMethod = url.searchParams.get("paymentMethod");

    if (cartData && customerData && paymentMethod) {
      setCart(JSON.parse(decodeURIComponent(cartData)));
      setCustomer(JSON.parse(decodeURIComponent(customerData)));
      setMethod(JSON.parse(decodeURIComponent(paymentMethod)));
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <PaymentForm cart={cart} customer={customer} method={method} />
    </>
  );
};

export default PaymentPage;
