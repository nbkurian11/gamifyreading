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

    // Cat sprite component with accessories
    const CatSprite = ({ level }) => (
        <div className="relative w-50 h-50">
            <img
                src="../images/spritecat.png"
                alt="Pixel Cat"
                className="w-50 h-50"
                style={{
                    imageRendering: 'pixelated',
                    imageRendering: '-moz-crisp-edges',
                    imageRendering: 'crisp-edges'
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
        return <div className="text-center text-white">Loading...</div>;
    }

    const { level, progressPercentage, xpIntoCurrentLevel, xpNeededForNextLevel } = getLevelInfo(totalXP);

    return (
        <div className="flex text-white rounded-xl p-6  max-w-4xl mx-auto mt-2"
            style={{
            }}>
            <div className="w-1/2 space-y-4">
                <div>
                    <h2 className="text-3xl text-[#B17039] font-bold mt-10">Your buddy!</h2>
                    <p className="text-[#90A844] text-xl font-bold">Level {level}</p>
                </div>

                <div>
                    <p className="text-sm text-[#B17039] mt-5 mb-1">Progress</p>
                    <div className="w-full h-4 bg-[#90A844] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-yellow-400 transition-all duration-500"
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
                <p className="text-xl font-semibold text-[#90A844] mt-4">Sprout</p>
            </div>
        </div>
    );
};

export default Sprite;
