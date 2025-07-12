import ClaimedRewards from "@/components/ClaimedRewards";
import LuckyDrawWrapper from "@/components/LuckyDrawWrapper";
import NoRewards from "@/components/NoReward";
import { getRewards } from "@/lib/actions/actions";

const Rewards = async () => {
    const rewards = await getRewards();

    return (
        <div className="p-4 md:p-6 lg:p-10">
            {rewards.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2">
                        <NoRewards />
                    </div>
                    <div>
                        <ClaimedRewards />
                    </div>
                </div>
            ) : (
                <LuckyDrawWrapper rewards={rewards} />
            )}
        </div>
    );
};

export default Rewards;
