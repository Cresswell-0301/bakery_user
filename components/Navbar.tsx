"use client";

import useCart from "@/lib/hooks/useCart";
import { useLoyaltyPoints } from "@/lib/providers/LoyaltyPoints";

import { UserButton, useUser } from "@clerk/nextjs";
import { CircleUserRound, Crown, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const cart = useCart();

    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [query, setQuery] = useState("");

    const [image, setImage] = useState("");
    const { points, setPoints } = useLoyaltyPoints();

    const [clerkId, setClerkId] = useState("");

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

    useEffect(() => {
        if (user?.id) {
            setClerkId(user.id);
            fetchLoyalPoints();
        } else {
            setClerkId("");
        }
    }, [user]);

    const fetchLoyalPoints = async () => {
        try {
            const response = await fetch(`/api/loyalty_points/` + user?.id, {
                method: "GET",
            });

            if (!response.ok) throw new Error("Failed to fetch loyalty points");

            const data = await response.json();

            setPoints(data.loyaltyPoints);
        } catch (error) {
            console.error("Failed to fetch loyalty points");
        }
    };

    return (
        <div className="sticky top-0 z-10 py-2 px-10 flex gap-2 justify-between items-center bg-white max-sm:px-2">
            {image != "" && (
                <Link href="/">
                    <Image src={image} alt="logo" width={100} height={70} />
                </Link>
            )}

            <div className="flex gap-4 text-base-bold max-lg:hidden">
                <Link href="/" className={`hover:text-red-1 ${pathname === "/" && "text-red-1"}`}>
                    Home
                </Link>
                <Link href="/products" className={`hover:text-red-1 ${pathname === "/products" && "text-red-1"}`}>
                    Products
                </Link>
                <Link href={user ? "/wishlist" : "/sign-in"} className={`hover:text-red-1 ${pathname === "/wishlist" && "text-red-1"}`}>
                    Wishlist
                </Link>
                <Link href={user ? "/orders" : "/sign-in"} className={`hover:text-red-1 ${pathname === "/orders" && "text-red-1"}`}>
                    Orders
                </Link>
                <Link href={user ? "/rewards" : "/sign-in"} className={`hover:text-red-1 ${pathname === "/rewards" && "text-red-1"}`}>
                    Rewards
                </Link>
            </div>

            <div className="flex gap-3 border border-grey-2 px-3 py-1 items-center rounded-lg">
                <input className="outline-none max-sm:max-w-[120px]" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <button disabled={query === ""} onClick={() => router.push(`/search/${query}`)}>
                    <Search className="cursor-pointer h-4 w-4 hover:text-red-1" />
                </button>
            </div>

            <div className="relative flex gap-3 items-center">
                <p className="flex items-center gap-1 border rounded-lg px-2 py-1 max-md:hidden">
                    {points}
                    <Crown size={18} />
                </p>

                <Link href="/cart" className="flex items-center gap-3 border rounded-lg px-2 py-1 hover:bg-black hover:text-white max-md:hidden">
                    <ShoppingCart />
                    <p className="text-base-bold">Cart ({cart.cartItems.length})</p>
                </Link>

                <Menu className="cursor-pointer lg:hidden" onClick={() => setDropdownMenu(!dropdownMenu)} />

                {dropdownMenu && (
                    <div className="absolute top-12 right-5 flex flex-col gap-4 p-3 rounded-lg border bg-white text-base-bold lg:hidden">
                        <Link href="/" className="hover:text-red-1">
                            Home
                        </Link>
                        <Link href="/products" className="hover:text-red-1">
                            Products
                        </Link>
                        <Link href={user ? "/wishlist" : "/sign-in"} className="hover:text-red-1">
                            Wishlist
                        </Link>
                        <Link href={user ? "/orders" : "/sign-in"} className="hover:text-red-1">
                            Orders
                        </Link>
                        <Link href="/cart">
                            <p className="flex gap-2 text-base-bold items-center">
                                <ShoppingCart size={20} /> ({cart.cartItems.length})
                            </p>
                        </Link>

                        <Link href="">
                            <p className="flex items-center text-base-bold gap-2">
                                <Crown size={18} className="ml-1" /> {points}
                            </p>
                        </Link>
                    </div>
                )}

                {user ? (
                    <UserButton afterSignOutUrl="/sign-in" />
                ) : (
                    <Link href="/sign-in">
                        <CircleUserRound />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
