"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoyaltyContextType {
    points: number;
    setPoints: (points: number) => void;
}

const LoyaltyPointsContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyPointsProvider = ({ children }: { children: ReactNode }) => {
    const [points, setPoints] = useState(0);

    return <LoyaltyPointsContext.Provider value={{ points, setPoints }}>{children}</LoyaltyPointsContext.Provider>;
};

export const useLoyaltyPoints = () => {
    const context = useContext(LoyaltyPointsContext);
    if (!context) throw new Error("useLoyaltyPoints must be used within LoyaltyPointsProvider");
    return context;
};
