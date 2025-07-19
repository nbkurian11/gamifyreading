import React, { useState, useRef, useEffect } from 'react';
import LeaderboardComponent from "../components/LeaderboardComponent.jsx";
import CurrentRead from '../components/CurrentRead.jsx';
import Goals from '../components/Goals.jsx';
import Challenges from '../components/Challenges.jsx';
import Sprite from '../components/Sprite.jsx';

// Your sliding taskbar component
const SlidingTaskbar = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const taskbarRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle clicking outside the taskbar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        taskbarRef.current &&
        buttonRef.current &&
        !taskbarRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle navigation
  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route);
    }
    setIsOpen(false); // Close taskbar after navigation
  };

  return (
    <>
      {/* Toggle Button - Always visible on the left, stays in same position */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 left-4 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-50' : 'opacity-100'}
          bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
          text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110
          border border-blue-500/30 backdrop-blur-sm`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          )}
        </svg>
      </button>

      {/* Backdrop Overlay - Only appears when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Taskbar - Pure overlay, doesn't affect document flow */}
      <div
        ref={taskbarRef}
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-r border-slate-700/50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">ReadQuest</h2>
                <p className="text-sm text-slate-400">Navigation</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {/* Dashboard/Home */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/50 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-slate-300 hover:text-white"
          >
            <div className="bg-slate-700/50 group-hover:bg-blue-500/20 p-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v6H8V5z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Dashboard</div>
              <div className="text-xs text-slate-500">Overview & stats</div>
            </div>
          </button>

          {/* Reading Challenges */}
          <button
            onClick={() => handleNavigation('challenges')}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/50 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-slate-300 hover:text-white"
          >
            <div className="bg-slate-700/50 group-hover:bg-purple-500/20 p-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Challenges</div>
              <div className="text-xs text-slate-500">Reading goals</div>
            </div>
          </button>

          {/* Leaderboard - Featured */}
          <button
            onClick={() => handleNavigation('leaderboard')}
            className="w-full flex items-center gap-4 p-4 text-left bg-gradient-to-r from-yellow-500/10 to-orange-500/10 
                     hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-white"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold flex items-center gap-2">
                Leaderboard 
                <span className="bg-yellow-500/30 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/50">
                  Featured
                </span>
              </div>
              <div className="text-xs text-yellow-300/70">Rankings & competition</div>
            </div>
          </button>

          {/* Library */}
          <button
            onClick={() => handleNavigation('library')}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/50 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-slate-300 hover:text-white"
          >
            <div className="bg-slate-700/50 group-hover:bg-emerald-500/20 p-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Library</div>
              <div className="text-xs text-slate-500">Your books</div>
            </div>
          </button>

          {/* Progress */}
          <button
            onClick={() => handleNavigation('progress')}
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-700/50 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-slate-300 hover:text-white"
          >
            <div className="bg-slate-700/50 group-hover:bg-indigo-500/20 p-2 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold">Progress</div>
              <div className="text-xs text-slate-500">Track your journey</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs">Online & Ready</span>
          </div>
        </div>
      </div>
    </>
  );
};

const Homepage = () => {
  const handleNavigate = (route) => {
    console.log('Navigating to:', route);
  };

  return (
    <div className="relative min-h-screen">
      {/* Overlay Taskbar */}
      <SlidingTaskbar onNavigate={handleNavigate} />
      
      <div className="grid grid-cols-6 grid-rows-5 gap-4 min-h-screen p-4">
        <div className="col-span-2 row-span-5 bg-red-600">
          <CurrentRead/>  
        </div>
        
        <div className="col-span-2 row-span-5 col-start-3">
          <Goals/>
        </div>

        <div className="col-span-2 row-span-3 col-start-5">
          <Challenges/>
        </div>
        
        <div className="col-span-2 row-span-2 col-start-5 row-start-4 bg-amber-300">
          <Sprite/>
        </div>
      </div>
    </div>
  );
};

export default Homepage;