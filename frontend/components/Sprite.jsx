import React, { useState, useEffect } from 'react';

const Sprite = ({ xpList = [], totalXP: totalXPProp = 0, isLoading: loadingProp = false }) => {
    const XP_PER_LEVEL = 100;
    const XP_MULTIPLIER = 1.5;

    const [fetchedXP, setFetchedXP] = useState(null);
    const [isLoading, setIsLoading] = useState(loadingProp);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/total-xp')
            .then(res => res.json())
            .then(data => {
                setFetchedXP(data.totalXP || 0);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch total XP:', err);
                setFetchedXP(0);
                setIsLoading(false);
            });
    }, [xpList, totalXPProp]); // The dependencies array ensures this runs when props change

    // Sum XP values from an array if provided, otherwise use props or fetched XP
    const totalXP = xpList.length
        ? xpList.reduce((sum, xp) => sum + (Number(xp) || 0), 0)
        : totalXPProp || fetchedXP || 0;

    const getLevelInfo = (xp) => {
        let level = 1;
        let xpRemaining = xp;
        let xpNeededForNext = XP_PER_LEVEL;

        while (xpRemaining >= xpNeededForNext) {
            xpRemaining -= xpNeededForNext;
            level++;
            xpNeededForNext = Math.round(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
        }

        const xpIntoLevel = xpRemaining;
        const progressPercentage = xpNeededForNext > 0
            ? Math.min(100, (xpIntoLevel / xpNeededForNext) * 100)
            : 100;

        return {
            level,
            xpIntoLevel,
            xpNeededForNext,
            progressPercentage
        };
    };

<<<<<<< HEAD
    const { level, xpIntoLevel, xpNeededForNext, progressPercentage } = getLevelInfo(totalXP);
=======
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
>>>>>>> e0a67ee485e867ace9036c098974cebcfde8ab57

    if (isLoading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    const CatSprite = () => (
        <div className="relative w-32 h-32">
            <img
                src="../images/spritecat.png"
                alt="Pixel Cat"
                className="w-32 h-32"
                style={{ imageRendering: 'pixelated' }}
            />
            {level >= 3 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-6 bg-blue-600 rounded-sm shadow-md">
                        <div className="w-6 h-4 bg-yellow-100 rounded-sm m-1">
                            <div className="w-5 h-px bg-gray-600 mt-1 ml-1" />
                            <div className="w-4 h-px bg-gray-600 mt-1 ml-1" />
                            <div className="w-5 h-px bg-gray-600 mt-1 ml-1" />
                        </div>
                    </div>
                </div>
            )}
            {level >= 8 && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 border-2 border-gray-700 rounded-full bg-blue-200 bg-opacity-40" />
                        <div className="w-2 h-px bg-gray-700" />
                        <div className="w-4 h-4 border-2 border-gray-700 rounded-full bg-blue-200 bg-opacity-40" />
                    </div>
                </div>
            )}
            {level >= 10 && (
                <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-300 opacity-20 -z-10" />
            )}
        </div>
    );

    return (
<<<<<<< HEAD
        <div
            className="flex bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-10"
            style={{ background: 'linear-gradient(135deg, #1a2232 0%, #2d3748 50%, #1a2232 100%)' }}
        >
            <div className="w-1/3 space-y-4">
=======
        <div className="flex text-white rounded-xl p-6  max-w-4xl mx-auto mt-2"
            style={{
            }}>
            <div className="w-1/2 space-y-4">
>>>>>>> e0a67ee485e867ace9036c098974cebcfde8ab57
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
                        />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        {xpIntoLevel} / {xpNeededForNext} XP
                    </p>
                </div>
            </div>
            <div className="w-2/3 flex flex-col items-center justify-center">
<<<<<<< HEAD
                <CatSprite />
                <p className="text-lg font-semibold text-yellow-300 mt-4">Mr. Readalot</p>
=======
                <CatSprite level={level} />
                <p className="text-xl font-semibold text-[#90A844] mt-4">Sprout</p>
>>>>>>> e0a67ee485e867ace9036c098974cebcfde8ab57
            </div>
        </div>
    );
};

export default Sprite;