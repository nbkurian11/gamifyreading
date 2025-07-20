import React from 'react';

const Sprite = ({ totalXP = 0, isLoading }) => {
    const XP_PER_LEVEL = 100;
    const XP_MULTIPLIER = 1.5;

    const getLevelInfo = (xp) => {
        let level = 1;
        let xpForCurrentLevel = 0;
        let nextLevelThreshold = XP_PER_LEVEL;

        while (xp >= nextLevelThreshold) {
            xpForCurrentLevel = nextLevelThreshold;
            level++;
            nextLevelThreshold += Math.round(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
        }

        const xpIntoCurrentLevel = xp - xpForCurrentLevel;
        const xpNeededForNextLevel = nextLevelThreshold - xpForCurrentLevel;
        const progressPercentage = (xpIntoCurrentLevel / xpNeededForNextLevel) * 100;

        return {
            level,
            progressPercentage: Math.min(100, progressPercentage),
            xpIntoCurrentLevel,
            xpNeededForNextLevel
        };
    };

    if (isLoading) {
        return (
            <div className="text-center text-white py-8">
                <p className="animate-pulse text-lg text-gray-400">Loading Sprite...</p>
            </div>
        );
    }

    const { level, progressPercentage, xpIntoCurrentLevel, xpNeededForNextLevel } = getLevelInfo(totalXP);

    return (
        <div className="flex bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-10">
            {/* Left: Info & Progress */}
            <div className="w-1/3 space-y-4">
                <div>
                    <h2 className="text-2xl font-bold">The Community's Sprite</h2>
                    <p className="text-yellow-400 text-xl font-bold">Level {level}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-300 mb-1">Progress</p>
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        {Math.floor(xpIntoCurrentLevel)} / {Math.floor(xpNeededForNextLevel)} XP
                    </p>
                </div>
            </div>

            {/* Right: Sprite Display */}
            <div className="w-2/3 flex flex-col items-center justify-center">
                <div className="bg-gradient-to-b from-sky-800 to-slate-900 rounded-xl w-48 h-48 flex items-center justify-center mb-4 border-2 border-blue-400">
                    <span className="text-gray-400">[ Sprite Placeholder ]</span>
                </div>
                <p className="text-lg font-semibold text-yellow-300">Mr. Readalot</p>
            </div>
        </div>
    );
};

export default Sprite;
