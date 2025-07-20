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
      icon: '1', 
      text: '1st', 
      bgColor: 'bg-amber-600',
      textColor: 'text-amber-100'
    },
    2: { 
      icon: '2', 
      text: '2nd', 
      bgColor: 'bg-amber-500',
      textColor: 'text-white'
    },
    3: { 
      icon: '3', 
      text: '3rd', 
      bgColor: 'bg-orange-600',
      textColor: 'text-orange-100'
    }
  };
  
  return configs[rank] || { 
    icon: rank.toString(), 
    text: `${rank}th`, 
    bgColor: 'bg-amber-400',
    textColor: 'text-white'
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

const LeaderboardComponent = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogoClick = () => {
    console.log('Navigating to home page...');
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1E8' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#F5F1E8' }} className="border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
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

      <div className="max-w-4xl mx-auto p-6">
        {/* Title Section */}
        <div className="text-center mb-12 mt-8">
          <div className="bg-white rounded-lg border border-amber-200 shadow-sm inline-block px-8 py-6">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#8B4513' }}>
              Leaderboard
            </h1>
            <p style={{ color: '#8B4513' }} className="opacity-80">
              Level up as you read and watch your buddy grow
            </p>
          </div>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-4">
          {leaderboardData.map((entry, idx) => {
            const rank = idx + 1;
            const rankInfo = getRankInfo(rank);
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={entry.username}
                className={`group transition-all duration-200 ${
                  isHovered ? 'transform scale-[1.02]' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-white rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                  <div className="flex items-center justify-between">
                    {/* Left side - Rank and Pet Info */}
                    <div className="flex items-center gap-6">
                      {/* Rank Badge */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 ${rankInfo.bgColor} ${rankInfo.textColor} flex items-center justify-center text-lg font-bold rounded-lg`}>
                          {rankInfo.icon}
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#C49B7C' }}>
                          {rankInfo.text}
                        </span>
                      </div>

                      {/* Pet Avatar & Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center text-2xl border border-amber-200">
                          {entry.avatar}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-bold mb-1" style={{ color: '#8B4513' }}>
                            {entry.petName}
                          </h3>
                          <p className="text-sm" style={{ color: '#C49B7C' }}>
                            @{entry.username}
                          </p>
                        </div>
                      </div>

                      {/* Level Display */}
                      <div className="bg-green-100 border border-green-200 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 font-semibold text-sm">
                            Level {entry.spriteLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Stats */}
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xl font-bold" style={{ color: '#8B4513' }}>
                          {mounted ? <AnimatedCounter value={entry.booksRead} /> : entry.booksRead}
                        </div>
                        <div className="text-xs font-medium" style={{ color: '#C49B7C' }}>Books</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold" style={{ color: '#8B4513' }}>
                          {mounted ? <AnimatedCounter value={entry.pagesRead} duration={1500} /> : entry.pagesRead}
                        </div>
                        <div className="text-xs font-medium" style={{ color: '#C49B7C' }}>Pages</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold" style={{ color: '#8B4513' }}>
                          {mounted ? <AnimatedCounter value={entry.badges} duration={800} /> : entry.badges}
                        </div>
                        <div className="text-xs font-medium" style={{ color: '#C49B7C' }}>Badges</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="bg-amber-100 h-2 rounded-full overflow-hidden border border-amber-200">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-1000 ease-out"
                        style={{ width: mounted ? `${Math.min((entry.spriteLevel / 10) * 100, 100)}%` : '0%' }}
                      />
                    </div>
                    <p className="text-xs mt-2 text-right" style={{ color: '#C49B7C' }}>
                      {entry.spriteLevel}/10 Progress
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg border border-amber-200 shadow-sm inline-block px-8 py-6">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#8B4513' }}>
              Keep Reading!
            </h3>
            <p className="max-w-md opacity-80" style={{ color: '#8B4513' }} >
              Complete challenges and read more books to climb the ranks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardComponent;