"use client";

import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { getCurrencyCode, getProductDetails } from "@/lib/actions/actions";
import { useUser } from "@clerk/nextjs";
import { use, useEffect, useState } from "react";

const Wishlist = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCodeType | null>();

  const getUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setSignedInUser(data);
      setLoading(false);
    } catch (err) {
      console.log("[users_GET", err);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const getWishlistProducts = async () => {
    setLoading(true);

    if (!signedInUser) return;

    const wishlistProducts = await Promise.all(
      signedInUser.wishlist.map(async (productId) => {
        const res = await getProductDetails(productId);
        return res;
      })
    );
    setWishlist(wishlistProducts);
    setLoading(false);
  };

  const getCurrency = async () => {
    setLoading(true);

    if (!signedInUser) return;

    try {
      const res = await fetch("/api/currency", {
        method: "GET",
      });
      const data = await res.json();
      setCurrencyCode(data);
    } catch (err) {
      console.log("[currency_GET]", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts();
      getCurrency();
    }
  }, [signedInUser]);

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      {wishlist.length === 0 && <p>No items in your wishlist</p>}
      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            updateSignedInUser={updateSignedInUser}
            code={currencyCode[0].code || "RM"}
          />
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default Wishlist;
