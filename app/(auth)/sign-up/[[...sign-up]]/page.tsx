"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Page() {
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchIconImage();
  }, []);

  const fetchIconImage = async () => {
    try {
        const response = await fetch("/api/icon_image", {
            method: "GET",
        });
        if (!response.ok) throw new Error("Failed to fetch icon image");
        const data = await response.json();
        if (data.length > 0) {
            setImage(data[0].image);
        }
    } catch (error) {
        console.error("Failed to fetch icon image");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src={image} alt="Logo" className="" width={297} />
      <SignUp />
    </div>
  );
}
