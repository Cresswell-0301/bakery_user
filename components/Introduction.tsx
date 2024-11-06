"use client";

import { useEffect, useState } from "react";

const Introduction = () => {
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    getIntro();
  }, []);

  const getIntro = async () => {
    const res = await fetch("/api/intro");
    const data = await res.json();

    if (data[0]) {
      setIntro(data[0].description);
    } else {
      setIntro(null);
    }
  };

  if (intro) {
    return (
      <div className="flex flex-col items-center gap-10 py-8 px-5">
        <p className="text-heading1-bold">Introduction</p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <p className="text-body-medium font-serif">{intro}</p>
        </div>
      </div>
    );
  }
};

export default Introduction;
