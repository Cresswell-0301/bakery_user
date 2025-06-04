"use client";

import { set } from "mongoose";
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
            // Normal Text
            <div className="flex flex-col items-center gap-10 my-3 py-6 mx-2 px-5 border-gray-200 border-[1px] rounded-lg bg-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-8">
                    <p className="text-body-medium font-serif" style={{ whiteSpace: 'pre-line' }}>{intro}</p>
                </div>
            </div>

            // Marquee Text (Animation)
            // <div className="my-3 mx-2 py-6 px-5 border border-gray-200 rounded-lg bg-gray-100">
            //     <div className="relative w-full h-16 overflow-hidden flex items-center">
            //         <p className="absolute whitespace-nowrap animate-marquee text-body-medium font-serif">
            //             {intro}
            //         </p>
            //     </div>
            // </div>
        );
    }
};

export default Introduction;
