"use client";

import { useState } from "react";
import ClaimedRewards from "@/components/ClaimedRewards";
import LuckyDraw from "@/components/LuckDraw";

const LuckyDrawWrapper = ({ rewards }: { rewards: RewardType[] }) => {
    const [refreshClaimedKey, setRefreshClaimedKey] = useState(0);

    const triggerClaimedRefresh = () => {
        setRefreshClaimedKey((prev) => prev + 1);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
                <LuckyDraw rewards={rewards} onRewardClaimed={triggerClaimedRefresh} />
            </div>
            <div>
                <ClaimedRewards key={refreshClaimedKey} />
            </div>
        </div>
    );
};

export default LuckyDrawWrapper;
