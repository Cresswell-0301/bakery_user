"use client";

import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useCart from "@/lib/hooks/useCart";
import { useRouter } from "next/navigation";
import { set } from "mongoose";

interface AddToCartProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const AddToCart = ({ product, updateSignedInUser }: AddToCartProps) => {
  const router = useRouter();

  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  const getUser = async () => {
    try {
      setIsLiked(cart.cartItems.some((item) => item.item._id === product._id));
    } catch (err) {
      console.error("Error getting shopping cart items:", err);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [cart.cartItems]);

  const handleCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/sign-in");
        return;
      } else {
        if (cart.cartItems.some((item) => item.item._id === product._id)) {
          cart.removeItem(product._id);
          setIsLiked(false);
        } else {
          cart.addItem({
            item: product,
            quantity,
            color: selectedColor,
            size: selectedSize,
          });
          setIsLiked(
            cart.cartItems.some((item) => item.item._id === product._id)
          );
        }
      }
    } catch (err) {
      console.log("[wishlist_POST]", err);
    }
  };

  return (
    <button onClick={handleCart}>
      <ShoppingCart fill={`${isLiked ? "black" : "white"}`} />
    </button>
  );
};

export default AddToCart;
