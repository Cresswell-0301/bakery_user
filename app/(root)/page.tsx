import BannerImage from "@/components/BannerImage";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

const Home = () => {
  return (
    <>
      <main className="flex flex-col items-center  py-2">
        <BannerImage />
      </main>
      <Collections />
      <ProductList />
    </>
  );
};

export const dynamic = "force-dynamic";

export default Home;
