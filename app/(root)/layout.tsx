import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "../globals.css";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import { LoyaltyPointsProvider } from "@/lib/providers/LoyaltyPoints";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: process.env.BAKERY_NAME,
    description: process.env.BAKERY_NAME,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClerkProvider>
                    <LoyaltyPointsProvider>
                        <ToasterProvider />
                        <Navbar />
                        {children}
                    </LoyaltyPointsProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
