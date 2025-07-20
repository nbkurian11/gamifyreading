import React, { useState, useEffect } from 'react';

const leaderboardData = [
  {
    petName: 'Fox',
    username: 'reader123',
    spriteLevel: 5,
    booksRead: 12,
    pagesRead: 350,
    badges: 3,
    avatar: '🦊'
  },
  {
    petName: 'Spark',
    username: 'bookworm',
    spriteLevel: 8,
    booksRead: 20,
    pagesRead: 600,
    badges: 5,
    avatar: '⚡'
  },
  {
    petName: 'October',
    username: 'nightowl',
    spriteLevel: 3,
    booksRead: 7,
    pagesRead: 210,
    badges: 1,
    avatar: '🦉'
  },
  {
    petName: 'Supernova',
    username: 'sunshine',
    spriteLevel: 10,
    booksRead: 30,
    pagesRead: 1000,
    badges: 8,
    avatar: '☀️'
  },
].sort((a, b) => b.spriteLevel - a.spriteLevel);

const getRankInfo = (rank) => {
  const configs = {
    1: { 
      icon: '👑', 
      text: '1st Place', 
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-600'
    },
    2: { 
      icon: '🥈', 
      text: '2nd Place', 
      gradient: 'from-gray-400 via-gray-500 to-gray-600',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-600'
    },
    3: { 
      icon: '🥉', 
      text: '3rd Place', 
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-600'
    }
  };
  
  return configs[rank] || { 
    icon: rank.toString(), 
    text: `${rank}th Place`, 
    gradient: 'from-amber-600 via-amber-700 to-amber-800',
    borderColor: 'border-amber-600',
    textColor: 'text-amber-700'
  };
};

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const PixelBorder = ({ children, className = "" }) => (
  <div className={`relative ${className}`}>
    {/* Pixel-style border effect */}
    <div className="absolute -inset-1 bg-amber-800 rounded-lg" 
         style={{
           clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))'
         }}>
    </div>
    <div className="relative bg-orange-50 rounded-lg">
      {children}
    </div>
  </div>
);

const LeaderboardComponent = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Header */}
      <div className="bg-amber-100 border-b-4 border-amber-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <div className="flex items-center gap-4">
              <div className="text-4xl">⭐</div>
              <div className="text-3xl">📖</div>
              <h1 className="text-4xl font-black text-amber-900" style={{ fontFamily: 'monospace' }}>
                SproutTale
              </h1>
            </div>
            

          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Title Section */}
        <div className="text-center mb-12 mt-8">
          <PixelBorder className="inline-block">
            <div className="px-12 py-8">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-5xl animate-bounce">🏆</div>
                <h1 className="text-6xl font-black text-amber-900" style={{ 
                  fontFamily: 'monospace',
                  textShadow: '3px 3px 0px #D97706, 6px 6px 0px #92400E'
                }}>
                  LEADERBOARD
                </h1>
                <div className="text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>🏆</div>
              </div>
              <p className="text-xl text-amber-800 font-bold" style={{ fontFamily: 'monospace' }}>
                Level up as you read and watch your buddy grow! 🌱
              </p>
            </div>
          </PixelBorder>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-6">
          {leaderboardData.map((entry, idx) => {
            const rank = idx + 1;
            const rankInfo = getRankInfo(rank);
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={entry.username}
                className={`group transition-all duration-300 ${
                  isHovered ? 'transform scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <PixelBorder className="w-full">
                  <div className="p-8 relative overflow-hidden">
                    {/* Decorative pattern background */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D97706' fill-opacity='0.4'%3E%3Cpolygon points='10 0 20 10 10 20 0 10'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '20px 20px'
                      }}>
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div className="absolute top-6 left-6 z-20">
                      <PixelBorder>
                        <div className={`w-16 h-16 bg-gradient-to-br ${rankInfo.gradient} flex items-center justify-center text-white font-black text-2xl shadow-lg`}>
                          {rankInfo.icon}
                        </div>
                      </PixelBorder>
                      <div className="mt-3 text-center">
                        <div className="bg-amber-200 px-3 py-1 rounded-full border-2 border-amber-600">
                          <span className="text-xs font-black text-amber-800" style={{ fontFamily: 'monospace' }}>
                            {rankInfo.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pl-28 pt-4">
                      <div className="flex items-center justify-between">
                        {/* Pet Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-6">
                            {/* Pixel-style avatar container */}
                            <PixelBorder>
                              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-5xl">
                                {entry.avatar}
                              </div>
                            </PixelBorder>
                            
                            <div>
                              <h3 className="text-4xl font-black text-amber-900 mb-2" style={{ 
                                fontFamily: 'monospace',
                                textShadow: '2px 2px 0px #D97706'
                              }}>
                                {entry.petName}
                              </h3>
                              <p className="text-amber-700 text-lg font-bold" style={{ fontFamily: 'monospace' }}>
                                @{entry.username}
                              </p>
                            </div>
                            
                            {/* Level Display */}
                            <PixelBorder>
                              <div className="bg-gradient-to-r from-green-400 to-green-500 px-6 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="text-white text-2xl">⭐</div>
                                  <span className="text-white font-black text-xl" style={{ fontFamily: 'monospace' }}>
                                    Level {entry.spriteLevel}
                                  </span>
                                </div>
                              </div>
                            </PixelBorder>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative mb-4">
                            <PixelBorder>
                              <div className="bg-amber-200 h-6 overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-2000 ease-out relative"
                                  style={{ width: mounted ? `${Math.min((entry.spriteLevel / 10) * 100, 100)}%` : '0%' }}
                                >
                                  <div className="absolute inset-0 bg-white/30"></div>
                                </div>
                              </div>
                            </PixelBorder>
                            <p className="text-sm text-amber-800 mt-2 text-center font-bold" style={{ fontFamily: 'monospace' }}>
                              Progress: {entry.spriteLevel}/10 ✨
                            </p>
                          </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex gap-4 ml-8">
                          <PixelBorder>
                            <div className="group/stat text-center bg-gradient-to-br from-amber-100 to-amber-200 p-6 min-w-[120px] hover:from-amber-200 hover:to-amber-300 transition-all duration-300">
                              <div className="text-4xl mb-3 group-hover/stat:animate-bounce">📚</div>
                              <div className="text-3xl font-black text-amber-900" style={{ fontFamily: 'monospace' }}>
                                {mounted ? <AnimatedCounter value={entry.booksRead} /> : entry.booksRead}
                              </div>
                              <div className="text-sm text-amber-800 font-bold" style={{ fontFamily: 'monospace' }}>Books</div>
                            </div>
                          </PixelBorder>
                          
                          <PixelBorder>
                            <div className="group/stat text-center bg-gradient-to-br from-amber-100 to-amber-200 p-6 min-w-[120px] hover:from-amber-200 hover:to-amber-300 transition-all duration-300">
                              <div className="text-4xl mb-3 group-hover/stat:animate-bounce">📖</div>
                              <div className="text-3xl font-black text-amber-900" style={{ fontFamily: 'monospace' }}>
                                {mounted ? <AnimatedCounter value={entry.pagesRead} duration={1500} /> : entry.pagesRead}
                              </div>
                              <div className="text-sm text-amber-800 font-bold" style={{ fontFamily: 'monospace' }}>Pages</div>
                            </div>
                          </PixelBorder>
                          
                          <PixelBorder>
                            <div className="group/stat text-center bg-gradient-to-br from-amber-100 to-amber-200 p-6 min-w-[120px] hover:from-amber-200 hover:to-amber-300 transition-all duration-300">
                              <div className="text-4xl mb-3 group-hover/stat:animate-bounce">🏅</div>
                              <div className="text-3xl font-black text-amber-900" style={{ fontFamily: 'monospace' }}>
                                {mounted ? <AnimatedCounter value={entry.badges} duration={800} /> : entry.badges}
                              </div>
                              <div className="text-sm text-amber-800 font-bold" style={{ fontFamily: 'monospace' }}>Badges</div>
                            </div>
                          </PixelBorder>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Sparkles */}
                    {isHovered && (
                      <>
                        <div className="absolute top-6 right-6 text-yellow-400 text-2xl animate-ping">✨</div>
                        <div className="absolute bottom-6 left-36 text-yellow-400 text-xl animate-ping" style={{ animationDelay: '0.3s' }}>⭐</div>
                        <div className="absolute top-1/2 right-12 text-yellow-400 text-lg animate-ping" style={{ animationDelay: '0.6s' }}>🌟</div>
                      </>
                    )}
                  </div>
                </PixelBorder>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <PixelBorder className="inline-block">
            <div className="p-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-yellow-400 text-3xl animate-spin" style={{ animationDuration: '3s' }}>⭐</div>
                <h3 className="text-4xl font-black text-amber-900" style={{ 
                  fontFamily: 'monospace',
                  textShadow: '2px 2px 0px #D97706'
                }}>
                  KEEP CLIMBING THE RANKS!
                </h3>
                <div className="text-yellow-400 text-3xl animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>⭐</div>
              </div>
              <p className="text-xl text-amber-800 font-bold max-w-2xl mx-auto" style={{ fontFamily: 'monospace' }}>
                Complete challenges, read more books, and become the ultimate Reading Champion! 🚀📚
              </p>
            </div>
          </PixelBorder>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardComponent;