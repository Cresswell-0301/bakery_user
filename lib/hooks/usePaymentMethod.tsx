import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const usePaymentMethod = () => {
  const [paymentMethod, setPaymentMethod] = useState([]);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const res = await fetch("/api/payment_method");
        if (!res.ok) throw new Error("Failed to fetch payment method data.");
        const data = await res.json();
        setPaymentMethod(data);
      } catch (err) {
        console.error("[fetchPaymentMethod]", err);
      }
    };

    fetchPaymentMethod();
  }, []);

  return paymentMethod;
};

export default usePaymentMethod;
