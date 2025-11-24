import { getProducts, getCurrencyCode } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";
import Link from "next/link";

type ProductListProps = {
  isHome?: boolean;
};

const ProductList = async ({ isHome = false }: ProductListProps) => {
  const products = await getProducts();
  const currencyCode = await getCurrencyCode();

  const publishedProducts = products.filter(
    (product: ProductType) => product.status === "Published"
  );

  return (
    <div className={isHome 
      ? "flex flex-col items-center gap-10 my-3 py-6 mx-2 px-1 border-gray-200 border-[1px] rounded-lg bg-gray-100"
      : "px-3 py-5"
    }>

      {isHome ? (
        <div className="w-full flex items-center justify-between">
          <p className="text-heading3-bold">Products</p>
          <Link href="/products" className="text-gray-600 hover:text-black">
            View More &gt;
          </Link>
        </div>
      ) : (
        <p className="text-heading3-bold my-10">Products</p>
      )}

      {!publishedProducts || publishedProducts.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        // <div className="flex flex-wrap justify-center gap-8">
        <div className="flex flex-wrap justify-center gap-4">
          {publishedProducts.map((product: ProductType) => (
            <ProductCard
              key={product._id}
              product={product}
              code={currencyCode[0].code}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const dynamic = "force-dynamic";

export default ProductList;
