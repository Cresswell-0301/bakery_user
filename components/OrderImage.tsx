"use client";

import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  productId: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, productId }) => {
  const handleClick = () => {
    window.location.href = `/products/${productId}`;
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      className="w-32 h-32 object-cover rounded-lg hover:cursor-pointer"
      onClick={handleClick}
    />
  );
};

export default ProductImage;
