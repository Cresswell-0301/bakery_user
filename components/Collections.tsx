import { getCollections } from "@/lib/actions/actions";
// import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div
          className={`grid gap-8 w-full
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
              <span className="flex flex-col w-fit justify-center text-center items-center bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer text-gray-800 font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 hover:translate-y-1 hover:translate-x-1 hover:rotate-1">
                {collection.title}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
