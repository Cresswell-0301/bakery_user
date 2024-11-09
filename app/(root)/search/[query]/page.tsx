import ProductCard from "@/components/ProductCard";
import { getSearchedProducts, getCurrencyCode } from "@/lib/actions/actions";

const SearchPage = async ({ params }: { params: { query: string } }) => {
  const searchedProducts = await getSearchedProducts(params.query);

  const decodedQuery = decodeURIComponent(params.query);

  const currencyCode = await getCurrencyCode();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading3-bold ">Search results for {decodedQuery}</p>
      {!searchedProducts ||
        (searchedProducts.length === 0 && (
          <p className="text-body-bold my-5">No result found</p>
        ))}
      <div className="flex flex-wrap justify-center gap-8">
        {searchedProducts?.map((product: ProductType) => (
          <ProductCard
            key={product._id}
            product={product}
            code={currencyCode[0].code}
          />
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default SearchPage;
