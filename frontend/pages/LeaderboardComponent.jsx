import React, { useState, useEffect } from 'react';

const leaderboardData = [
  {
    petName: 'Fluffy',
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
    petName: 'Shadow',
    username: 'nightowl',
    spriteLevel: 3,
    booksRead: 7,
    pagesRead: 210,
    badges: 1,
    avatar: '🦉'
  },
  {
    petName: 'Sunny',
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
      glow: 'shadow-yellow-500/60',
      bgGlow: 'from-yellow-400/20 to-amber-600/20',
      textColor: 'text-yellow-300'
    },
    2: { 
      icon: '🥈', 
      text: '2nd Place', 
      gradient: 'from-gray-300 via-gray-400 to-gray-500',
      glow: 'shadow-gray-400/60',
      bgGlow: 'from-gray-400/20 to-slate-500/20',
      textColor: 'text-gray-300'
    },
    3: { 
      icon: '🥉', 
      text: '3rd Place', 
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      glow: 'shadow-orange-500/60',
      bgGlow: 'from-orange-400/20 to-red-500/20',
      textColor: 'text-orange-300'
    }
  };
  
  return configs[rank] || { 
    icon: rank.toString(), 
    text: `${rank}th Place`, 
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    glow: 'shadow-blue-500/50',
    bgGlow: 'from-blue-400/10 to-purple-500/10',
    textColor: 'text-blue-300'
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

const FloatingParticle = ({ delay = 0 }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setPosition({
          x: Math.random() * 100,
          y: Math.random() * 100
        });
      }, 3000 + Math.random() * 2000);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60 transition-all duration-[3000ms] ease-in-out"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        boxShadow: '0 0 6px currentColor'
      }}
    />
  );
};

const LeaderboardComponent = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 200} />
        ))}
      </div>
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-75"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl px-12 py-6 border border-slate-600/50">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-4xl animate-bounce">🏆</div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  READING CHAMPIONS
                </h1>
                <div className="text-4xl animate-bounce animation-delay-1000">🏆</div>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
            </div>
          </div>
          <p className="text-slate-300 mt-6 text-xl font-medium">Level up your reading journey and join the elite!</p>
        </div>

        {/* Enhanced Leaderboard Cards */}
        <div className="space-y-6">
          {leaderboardData.map((entry, idx) => {
            const rank = idx + 1;
            const rankInfo = getRankInfo(rank);
            const isHovered = hoveredCard === idx;

            return (
              <div
                key={entry.username}
                className={`group relative transition-all duration-500 ${
                  isHovered ? 'transform scale-[1.03] z-20' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${rankInfo.bgGlow} rounded-3xl blur-xl transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-50'
                }`}></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-600/50 overflow-hidden shadow-2xl">
                  {/* Rank Badge with Enhanced Design */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${rankInfo.gradient} rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl ${rankInfo.glow} animate-pulse`}>
                      <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                      <span className="relative z-10">{rankInfo.icon}</span>
                    </div>
                    <div className="mt-2 text-center">
                      <span className={`text-xs font-bold ${rankInfo.textColor} bg-slate-800/90 px-3 py-1 rounded-full border border-slate-600/50 whitespace-nowrap shadow-lg`}>
                        {rankInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Content */}
                  <div className="relative p-8 pl-28 pt-10">
                    <div className="flex items-center justify-between">
                      {/* Pet Info with Avatar */}
                      <div className="flex-1">
                        <div className="flex items-center gap-6 mb-4">
                          <div className="text-6xl animate-pulse">{entry.avatar}</div>
                          <div>
                            <h3 className="text-3xl font-bold text-white mb-2 tracking-wide">{entry.petName}</h3>
                            <p className="text-slate-400 text-lg">@{entry.username}</p>
                          </div>
                          <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 px-6 py-3 rounded-full shadow-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-white text-lg animate-spin-slow">⭐</div>
                              <span className="text-white font-black text-lg">Level {entry.spriteLevel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative">
                          <div className="bg-slate-700/80 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-full rounded-full transition-all duration-[2000ms] ease-out relative"
                              style={{ width: mounted ? `${Math.min((entry.spriteLevel / 10) * 100, 100)}%` : '0%' }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2 text-center font-medium">
                            Progress: {entry.spriteLevel}/10 ✨
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Stats Cards */}
                      <div className="flex gap-4 ml-8">
                        <div className="group/stat text-center bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-4 min-w-[100px] border border-slate-600/50 shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
                          <div className="text-3xl mb-2 group-hover/stat:animate-bounce">📚</div>
                          <div className="text-2xl font-black text-white">
                            {mounted ? <AnimatedCounter value={entry.booksRead} /> : entry.booksRead}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Books</div>
                        </div>
                        
                        <div className="group/stat text-center bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-4 min-w-[100px] border border-slate-600/50 shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                          <div className="text-3xl mb-2 group-hover/stat:animate-bounce">📖</div>
                          <div className="text-2xl font-black text-white">
                            {mounted ? <AnimatedCounter value={entry.pagesRead} duration={1500} /> : entry.pagesRead}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Pages</div>
                        </div>
                        
                        <div className="group/stat text-center bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-4 min-w-[100px] border border-slate-600/50 shadow-xl hover:shadow-yellow-500/20 transition-all duration-300">
                          <div className="text-3xl mb-2 group-hover/stat:animate-bounce">🏅</div>
                          <div className="text-2xl font-black text-white">
                            {mounted ? <AnimatedCounter value={entry.badges} duration={800} /> : entry.badges}
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Badges</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Hover Effects */}
                  {isHovered && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl pointer-events-none"></div>
                      <div className="absolute top-4 right-4 text-cyan-400 animate-ping">✨</div>
                      <div className="absolute bottom-4 left-4 text-blue-400 animate-ping animation-delay-300">✨</div>
                      <div className="absolute top-1/2 right-8 text-purple-400 animate-ping animation-delay-700">✨</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-16 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/50 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-yellow-400 text-2xl animate-spin-slow">⭐</div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                KEEP CLIMBING THE RANKS!
              </h3>
              <div className="text-yellow-400 text-2xl animate-spin-slow animation-delay-1000">⭐</div>
            </div>
            <p className="text-slate-300 text-lg font-medium">Complete challenges, read more books, and become the ultimate Reading Champion! 🚀</p>
            <div className="mt-4 w-48 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default LeaderboardComponent;
