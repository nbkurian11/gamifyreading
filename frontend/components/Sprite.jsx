import React from 'react';

const Sprite = ({ totalXP , isLoading }) => {
    
    const XP_PER_LEVEL = 100;
    const XP_MULTIPLIER = 1.5;

    // This is the core fix. It creates a safe variable
    // that is guaranteed to be a number.
    // If totalXP is undefined, it will be 0. Otherwise, it will be the actual value.
    const xpToUse = isNaN(parseInt(totalXP)) ? 0 : parseInt(totalXP);

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
            progressPercentage: Math.min(100, progressPercentage), // Cap at 100%
            xpIntoCurrentLevel,
            xpNeededForNextLevel
        };
    };

    if (isLoading) {
        return (
            <div className="flex bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-10 items-center justify-center h-64">
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xl font-semibold text-gray-300">Loading Sprite...</span>
                </div>
            </div>
        );
    }

    // Now this call is safe because it uses xpToUse, which is always a number.
    const { level, progressPercentage, xpIntoCurrentLevel, xpNeededForNextLevel } = getLevelInfo(xpToUse);

    return (
        <div className="flex flex-col md:flex-row bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-full mx-auto mt-10 gap-6 items-center justify-center">
            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                        The Community's Sprite
                    </h2>
                    <p className="text-yellow-400 text-xl font-bold">Level {level}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-300 mb-1">Progress to next level</p>
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        {Math.floor(xpIntoCurrentLevel)} / {Math.floor(xpNeededForNextLevel)} XP
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-6 md:mt-0">
                <div className="bg-gradient-to-b from-sky-800 to-slate-900 rounded-xl w-48 h-48 flex items-center justify-center mb-4 border-2 border-blue-400 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    {/* Placeholder for the actual sprite image or animation */}
                    <span className="text-gray-400 text-sm font-semibold">[ Awesome Sprite Here! ]</span>
                </div>
                <p className="text-lg font-semibold text-yellow-300">Mr. Readalot</p>
            </div>
        </div>
    );
};

export default Sprite;