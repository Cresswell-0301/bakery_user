"use client";

import { getSpinPointsSetting } from "@/lib/actions/actions";
import { useLoyaltyPoints } from "@/lib/providers/LoyaltyPoints";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useState, useMemo, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import toast from "react-hot-toast";

const LuckyDraw = ({ rewards, onRewardClaimed }: { rewards: RewardType[]; onRewardClaimed?: () => void }) => {
    const router = useRouter();
    const { user } = useUser();
    const userId = user?.id;
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [selectedReward, setSelectedReward] = useState<RewardType | null>(null);
    const { points, setPoints } = useLoyaltyPoints();
    const [pointsPerSpin, setPointsPerSpin] = useState<number | null>(null);

    const spinAudioRef = useRef<HTMLAudioElement | null>(null);
    const resultAudioRef = useRef<HTMLAudioElement | null>(null);

    const { expandedRewards, data } = useMemo(() => {
        const colorPalette = ["#8D2F2F", "#C26A6A", "#E3A5A5", "#F3D3C1"];

        // Step 1: Group rewards by type
        const groupedByType: Record<string, RewardType[]> = {};
        rewards.forEach((reward) => {
            if (!groupedByType[reward.type]) {
                groupedByType[reward.type] = [];
            }
            groupedByType[reward.type].push(reward);
        });

        // Step 2: Normalize each reward's change_weight
        const normalizedRewards: RewardType[] = [];
        for (const type in groupedByType) {
            const rewardsOfType = groupedByType[type];
            const totalValue = rewardsOfType.reduce((sum, r) => sum + r.value, 0);

            rewardsOfType.forEach((reward) => {
                const adjustedWeight = reward.change_weight / totalValue;
                normalizedRewards.push({
                    ...reward,
                    change_weight: adjustedWeight,
                });
            });
        }

        // Step 3: Find the reward with the smallest weight
        const minWeightReward = normalizedRewards.reduce((min, r) => (r.change_weight < min.change_weight ? r : min), normalizedRewards[0]);

        // Step 4: Expand rewards into segments
        const allSegments: { reward: RewardType; weight: number }[] = [];
        normalizedRewards.forEach((reward) => {
            const weightPerSegment = reward.change_weight;
            for (let i = 0; i < reward.value; i++) {
                allSegments.push({ reward, weight: weightPerSegment });
            }
        });

        // Step 5: Move the smallest-weight reward to first (for styling)
        const fixedSegmentIndex = allSegments.findIndex((seg) => seg.reward._id === minWeightReward._id);
        const fixedSegment = allSegments.splice(fixedSegmentIndex, 1)[0];

        const shuffleArray = <T,>(array: T[]): T[] => {
            const result = [...array];
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
        };

        const shuffledSegments = shuffleArray(allSegments);
        const expandedRewards = [fixedSegment, ...shuffledSegments];

        const data = expandedRewards.map((entry, index) => {
            const backgroundColor = index === 0 ? "#E9C46A" : colorPalette[(index - 1) % colorPalette.length];
            return {
                option: entry.reward.name,
                style: {
                    backgroundColor,
                    textColor: "#fff",
                    fontSize: 18,
                },
            };
        });

        return { expandedRewards, data };
    }, [rewards]);

    // Spin logic using expanded weights
    const spinWheel = async () => {
        if (pointsPerSpin !== null && points < pointsPerSpin) {
            toast.dismiss();
            toast.error(`You need at least ${pointsPerSpin} points to spin.`);
            return;
        }

        // Deduct points before spinning
        try {
            const res = await fetch("/api/deduct-points", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    pointsToDeduct: pointsPerSpin,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to deduct points");
                return;
            }

            const data = await res.json();
            setPoints(data.currentPoints);
        } catch (error) {
            toast.error("Spin failed. Please try again.");
            return;
        }

        // Play spin audio and trigger spin
        if (spinAudioRef.current) {
            spinAudioRef.current.currentTime = 0;
            spinAudioRef.current.play();
        }

        const totalWeight = expandedRewards.reduce((sum, e) => sum + e.weight, 0);
        const rand = Math.random() * totalWeight;

        let acc = 0;
        let selectedIndex = 0;

        for (let i = 0; i < expandedRewards.length; i++) {
            acc += expandedRewards[i].weight;
            if (rand <= acc) {
                selectedIndex = i;
                break;
            }
        }

        setPrizeNumber(selectedIndex);
        setMustSpin(true);
    };

    useEffect(() => {
        const fetchSpinPoints = async () => {
            try {
                const pts = await getSpinPointsSetting();
                setPointsPerSpin(pts.pointsPerSpin);
            } catch (err) {
                toast.error("Failed to fetch spin cost");
            }
        };

        fetchSpinPoints();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-2xl font-bold mb-4 text-white">Lucky Draw</h1>

            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                outerBorderWidth={0}
                radiusLineColor="transparent"
                radiusLineWidth={1}
                spinDuration={1}
                onStopSpinning={async () => {
                    if (spinAudioRef.current) {
                        spinAudioRef.current.pause();
                        spinAudioRef.current.currentTime = 0;
                    }

                    setMustSpin(false);

                    const reward = expandedRewards[prizeNumber].reward;
                    setSelectedReward(reward);

                    // Play result sound based on reward type
                    if (resultAudioRef.current) {
                        resultAudioRef.current.pause();
                        resultAudioRef.current.currentTime = 0;

                        resultAudioRef.current.src = reward.type === "try_again" ? "/sounds/try_again.mp3" : "/sounds/reward.mp3";

                        await resultAudioRef.current.play();
                    }

                    if (reward.type != "try_again") {
                        try {
                            const res = await fetch("/api/reward-claim", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    user_id: userId,
                                    reward_id: reward._id,
                                }),
                            });

                            if (!res.ok) {
                                throw new Error("Failed to update reward");
                            }

                            const data = await res.json();

                            if (reward.direct_claim) {
                                setPoints(data.currentPoints);
                                toast.success(`🎁 You claimed: ${reward.name}`);
                            } else {
                                toast.success(`🎉 You won: ${reward.name}.\nOur admin will contact you soon!`);
                            }
                        } catch (error) {
                            toast.error("Failed to update reward status.");
                        }
                    }
                }}
            />

            <p className="text-sm text-gray-300 mt-3">💡{pointsPerSpin ?? "..."} points = 1 spin</p>

            {pointsPerSpin !== null && (
                <button
                    onClick={spinWheel}
                    className={`mt-6 px-6 py-2 text-white rounded-lg disabled:opacity-50 
                    ${pointsPerSpin !== null && points < pointsPerSpin ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"}`}
                    disabled={mustSpin || (pointsPerSpin !== null && points < pointsPerSpin)}
                >
                    {pointsPerSpin !== null && points < pointsPerSpin ? (
                        <>
                            <span role="img" aria-label="locked">
                                🔒
                            </span>{" "}
                            Not enough points
                        </>
                    ) : (
                        "Start"
                    )}
                </button>
            )}

            {selectedReward && !mustSpin && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
                    <div className="bg-white text-black rounded-xl p-6 shadow-lg w-[90%] max-w-sm text-center">
                        <h2 className="text-2xl font-bold mb-2">
                            {selectedReward.type === "try_again" ? "🙁 Please Try Again!" : selectedReward.direct_claim ? "🎁 Instant Reward!" : "🎉 Congratulations! 🎉"}
                        </h2>
                        <p className="text-lg font-semibold text-pink-600">{selectedReward.name}</p>
                        <p className="text-sm text-gray-600 mt-2">{selectedReward.description}</p>
                        <button
                            onClick={() => {
                                if (resultAudioRef.current) {
                                    resultAudioRef.current.pause();
                                    resultAudioRef.current.currentTime = 0;
                                }

                                setSelectedReward(null);
                                router.refresh();
                                onRewardClaimed?.();
                            }}
                            className="mt-6 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Audio */}
            <audio ref={spinAudioRef} src="/sounds/spin.wav" preload="auto" />
            <audio ref={resultAudioRef} preload="auto" />
        </div>
    );
};

export default LuckyDraw;
