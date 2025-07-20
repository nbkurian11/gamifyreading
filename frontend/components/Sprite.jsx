import React from 'react';

const Sprite = ({ totalXP , isLoading }) => {
    
    const XP_PER_LEVEL = 100;
    const XP_MULTIPLIER = 1.5;

    // A more efficient way to handle the typecasting.
    // We parse the value once and store it.
    const parsedXP = parseInt(totalXP);
    // Then we use a simpler check for NaN to get our final value.
    const xpToUse = isNaN(parsedXP) ? 0 : parsedXP;

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

    // Cat sprite component with accessories
    const CatSprite = ({ level }) => (
        <div className="relative w-32 h-32">
            <img
                src="../images/spritecat.png"
                alt="Pixel Cat"
                className="w-32 h-32"
                style={{
                    imageRendering: 'pixelated'
                }}
            />
            {/* Book accessory */}
            {level >= 3 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-6 bg-blue-600 rounded-sm shadow-md">
                        <div className="w-6 h-4 bg-yellow-100 rounded-sm m-1">
                            <div className="w-5 h-px bg-gray-600 mt-1 ml-1"></div>
                            <div className="w-4 h-px bg-gray-600 mt-1 ml-1"></div>
                            <div className="w-5 h-px bg-gray-600 mt-1 ml-1"></div>
                        </div>
                    </div>
                </div>
            )}
            {/* Glasses accessory */}
            {level >= 8 && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 border-gray-700 rounded-full bg-blue-200 bg-opacity-40"></div>
                        <div className="w-2 h-px bg-gray-700"></div>
                        <div className="w-4 h-4 border-2 border-gray-700 rounded-full bg-blue-200 bg-opacity-40"></div>
                    </div>
                </div>
            )}
            {/* Glow effect */}
            {level >= 10 && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-300 opacity-20 -z-10"></div>
            )}
        </div>
    );

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

    const { level, progressPercentage, xpIntoCurrentLevel, xpNeededForNextLevel } = getLevelInfo(xpToUse);

    return (
        <div className="flex bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-10"
            style={{
                background: 'linear-gradient(135deg, #1a2232 0%, #2d3748 50%, #1a2232 100%)'
            }}>
            <div className="w-1/3 space-y-4">
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

            <div className="w-2/3 flex flex-col items-center justify-center">
                <CatSprite level={level} />
                <p className="text-lg font-semibold text-yellow-300 mt-4">Mr. Readalot</p>
            </div>
        </div>
    );
};

export default Sprite;