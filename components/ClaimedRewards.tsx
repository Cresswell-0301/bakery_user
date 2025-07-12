"use client";

import { useEffect, useState } from "react";

const ClaimedRewards = () => {
    const [claimed, setClaimed] = useState<RewardClaimType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const res = await fetch("/api/reward-claim");
                const data = await res.json();
                setClaimed(data);
            } catch (err) {
                console.error("Failed to fetch claimed rewards:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClaims();
    }, []);

    return (
        <div className="mt-10">
            <h2 className="text-xl font-bold mb-3 text-white">Your Rewards</h2>
            <div className="space-y-2 max-h-[685px] overflow-y-auto pr-1">
                {loading && <p className="text-sm text-white">Loading your rewards...</p>}

                {claimed.length === 0 && !loading && <p className="text-sm text-gray-400">No claimed rewards found.</p>}

                {claimed.map((item) => (
                    <div key={item._id} className="p-3 border rounded bg-white shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{item.reward?.name || "Unknown Reward"}</p>
                            <p className="text-sm text-gray-500 capitalize">
                                <span
                                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                        item.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : item.status === "claimed"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-200 text-red-600"
                                    }`}
                                >
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </p>
                        </div>

                        {item._id && <p className="text-xs text-gray-500 mt-1">ID : {item._id.slice(0, 6) + "...." + item._id.slice(-6)}</p>}

                        {item.reward?.description && <p className="text-sm text-gray-600 mt-1">{item.reward.description}</p>}

                        <p className="text-xs text-gray-400">
                            {new Date(item.claim_date).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClaimedRewards;
