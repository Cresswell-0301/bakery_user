"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import useCart from "@/lib/hooks/useCart";
import AddToCart from "./AddToCart";

interface ProductCardProps {
  product: ProductType;
  code: CurrencyCodeType["code"];
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({
  product,
  updateSignedInUser,
  code,
}: ProductCardProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[220px] flex flex-col gap-2"
    >
      <Image
        src={product.media[0]}
        alt="product"
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
      />
      <div>
        <p className="text-base-bold">{product.title}</p>
        <p className="text-small-medium text-grey-2">{product.category}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-body-bold">
          {code} {product.price}
        </p>

        <div className="flex justify-between items-center gap-5">
          <HeartFavorite
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
          <AddToCart
            product={product}
            updateSignedInUser={updateSignedInUser}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
