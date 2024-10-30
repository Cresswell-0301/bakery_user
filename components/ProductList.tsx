import { getProducts, getCurrencyCode } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";

const ProductList = async () => {
  const products = await getProducts();
  const currencyCode = await getCurrencyCode();

  const publishedProducts = products.filter(
    (product: ProductType) => product.status === "Published"
  );

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold">Products</p>
      {!publishedProducts || publishedProducts.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
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
