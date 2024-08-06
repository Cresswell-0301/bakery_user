import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

import Image from "next/image";

const Home = () => {
  return (
    <>
      <Image
        src="/banner.png"
        alt="banner"
        width={2000}
        height={1000}
        className="w-screen"
      />
      <Collections />
      <ProductList />
    </>
  );
};

export const dynamic = "force-dynamic";
export const revalidate = 60; // revalidate the data at most every miniute

export default Home;
