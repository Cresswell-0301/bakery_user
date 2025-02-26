import { getCollections } from "@/lib/actions/actions";
// import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 my-3 py-6 mx-2 px-5 border-gray-200 border-[1px] rounded-lg bg-gray-100">
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div
          className={`grid gap-6 w-full
            grid-cols-2
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-6
            2xl:grid-cols-${collections.length > 7 ? 7 : collections.length}
            3xl:grid-cols-8
            4xl:grid-cols-9
          `}
        >
          {collections.map((collection: CollectionType) => (
            <Link
              href={`/collections/${collection._id}`}
              key={collection._id}
              className="flex justify-center"
            >
              {/* <Image
                key={collection._id}
                src={collection.image}
                alt={collection.title}
                width={350}
                height={200}
                className="rounded-lg cursor-pointer"
              /> */}
              <div className="
                flex flex-col w-fit justify-center text-center items-center bg-gray-100 px-4 py-2 transform
                rounded-lg cursor-pointer text-gray-800 font-semibold transition-all duration-200 shadow-md border-white border-[1px]
                hover:bg-gray-200 hover:shadow-lg hover:translate-y-1 hover:translate-x-1 hover:rotate-1 hover:scale-105
              ">
                <h3 className="text-gray-800 font-semibold">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
