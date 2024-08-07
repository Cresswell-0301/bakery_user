"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "./Loader";

const BannerImage = () => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  // Function to show the previous slide
  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Function to show the next slide
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // useEffect hook to handle automatic slide transition
  useEffect(() => {
    // Start interval for automatic slide change if not hovered
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);

      // Cleanup the interval on component unmount
      return () => {
        clearInterval(interval);
      };
    }
  }, [isHovered, images]);

  // Handle mouse over event
  const handleMouseOver = (): void => {
    setIsHovered(true);
  };

  // Handle mouse leave event
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  const getImages = async () => {
    const res = await fetch("/api/banner");
    const data = await res.json();
    if (data) {
      setImages(data[0].image);
    } else {
      setImages(["/banner.png"]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getImages();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="relative w-full">
      <div
        className="relative w-full aspect-w-2 aspect-h-1"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={images[currentIndex]}
          alt={`Slider Image ${currentIndex + 1}`}
          width={2000}
          height={1000}
          className="rounded-xl transition-all duration-500 ease-in-out cursor-pointer"
        />
      </div>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full shadow-md hover:bg-opacity-75"
        onClick={prevSlide}
      >
        <ChevronLeft className="text-gray-400 group-hover:text-white" />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full shadow-md hover:bg-opacity-75"
        onClick={nextSlide}
      >
        <ChevronRight className="text-gray-400 group-hover:text-white" />
      </button>

      <div className="absolute bottom-3 w-full h-fit">
        <div className="flex justify-center px-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-10 mx-1 ${
                index === currentIndex
                  ? "bg-[#beff46] rounded-xl"
                  : "bg-gray-300 rounded-xl"
              } transition-all duration-500 ease-in-out`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerImage;
