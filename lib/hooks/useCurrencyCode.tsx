import { useState, useEffect } from "react";

const useCurrencyCode = () => {
  const [currencyCode, setCurrencyCode] = useState<string>("");

  useEffect(() => {
    const fetchCurrencyCode = async () => {
      try {
        const res = await fetch("/api/currency");
        if (!res.ok) throw new Error("Failed to fetch currency data.");
        const data = await res.json();
        if (data.length > 0) {
          setCurrencyCode(data[0].code);
        }
      } catch (err) {
        console.error("[fetchCurrencyCode]", err);
      }
    };

    fetchCurrencyCode();
  }, []);

  return currencyCode;
};

export default useCurrencyCode;
