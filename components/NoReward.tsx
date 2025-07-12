"use client";

const NoRewards = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center bg-transparent rounded-lg shadow-md p-10">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-3xl font-semibold text-white mb-2">No Rewards Available</h2>
            <p className="text-white mb-6">Check back soon for exciting new rewards and chances to win!</p>
            <button onClick={() => location.reload()} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                Refresh
            </button>
        </div>
    );
};

export default NoRewards;
