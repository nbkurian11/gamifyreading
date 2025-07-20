import React, { useState, useRef, useEffect } from 'react';

const SlidingTaskbar = ({ userXP = 0, selectedItems = {}, onNavigate, onItemSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const taskbarRef = useRef(null);
  const buttonRef = useRef(null);

  // Items that unlock based on XP thresholds
  const gridItems = [
    { id: 'wizard_hat', name: 'Wizard Hat', type: 'hat', xpRequired: 100, emoji: '🧙‍♂️', rarity: 'common' },
    { id: 'glasses', name: 'Reading Glasses', type: 'accessory', xpRequired: 250, emoji: '👓', rarity: 'common' },
    { id: 'crown', name: 'Golden Crown', type: 'hat', xpRequired: 500, emoji: '👑', rarity: 'legendary' },
    { id: 'cape', name: 'Hero Cape', type: 'outfit', xpRequired: 150, emoji: '🦸', rarity: 'rare' },
    { id: 'monocle', name: 'Fancy Monocle', type: 'accessory', xpRequired: 400, emoji: '🧐', rarity: 'rare' },
    { id: 'book', name: 'Magic Book', type: 'weapon', xpRequired: 300, emoji: '📖', rarity: 'rare' },
    { id: 'cat', name: 'Reading Cat', type: 'pet', xpRequired: 600, emoji: '🐱', rarity: 'rare' },
    { id: 'owl', name: 'Wise Owl', type: 'pet', xpRequired: 800, emoji: '🦉', rarity: 'legendary' },
    { id: 'armor', name: 'Knight Armor', type: 'outfit', xpRequired: 1000, emoji: '⚔️', rarity: 'legendary' }
  ];

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
    setIsOpen(false);
  };

  // Handle item selection
  const handleItemClick = (item) => {
    if (userXP >= item.xpRequired && onItemSelect) {
      onItemSelect(item);
    }
  };

  // Check if item is unlocked
  const isItemUnlocked = (item) => userXP >= item.xpRequired;

  // Check if item is selected
  const isItemSelected = (item) => selectedItems[item.type] === item.id;

  // Get rarity border color
  const getRarityBorder = (rarity, isUnlocked, isSelected) => {
    if (!isUnlocked) return 'border-slate-600';
    if (isSelected) return 'border-blue-400 shadow-lg shadow-blue-400/30';
    
    switch (rarity) {
      case 'common': return 'border-gray-400 hover:border-gray-300';
      case 'rare': return 'border-blue-400 hover:border-blue-300';
      case 'legendary': return 'border-yellow-400 hover:border-yellow-300';
      default: return 'border-gray-400';
    }
  };

  // Get background color based on state
  const getItemBackground = (item) => {
    const isUnlocked = isItemUnlocked(item);
    const isSelected = isItemSelected(item);
    
    if (!isUnlocked) return 'bg-slate-800/50';
    if (isSelected) return 'bg-blue-500/20';
    
    switch (item.rarity) {
      case 'common': return 'bg-slate-700/50 hover:bg-slate-600/50';
      case 'rare': return 'bg-blue-900/30 hover:bg-blue-800/30';
      case 'legendary': return 'bg-yellow-900/30 hover:bg-yellow-800/30';
      default: return 'bg-slate-700/50';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out
          ${isOpen ? 'left-80 opacity-0 pointer-events-none' : 'left-4 opacity-100'}
          bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
          text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110
          border border-blue-500/30 backdrop-blur-sm`}
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sliding Taskbar */}
      <div
        ref={taskbarRef}
        className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-r border-slate-700/50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-900/80">
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
                <p className="text-sm text-slate-400">{userXP} XP</p>
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

        {/* Navigation Section */}
        <div className="p-4 border-b border-slate-700/50">
          <button
            onClick={() => handleNavigation('http://localhost:5173/leaderboard')}
            className="w-full flex items-center gap-3 p-3 text-left bg-gradient-to-r from-yellow-500/10 to-orange-500/10 
                     hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 rounded-xl 
                     transition-all duration-200 group hover:transform hover:scale-[1.02] text-white"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold">Leaderboard</div>
              <div className="text-xs text-yellow-300/70">Rankings & competition</div>
            </div>
          </button>
        </div>

        {/* Items Grid Section */}
        <div className="flex-1 p-4">
          <div className="bg-slate-800/30 rounded-3xl p-6 border border-slate-700/50 h-full">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Unlockable Items</h3>
            
            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {gridItems.map((item, index) => {
                const isUnlocked = isItemUnlocked(item);
                const isSelected = isItemSelected(item);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={!isUnlocked}
                    className={`aspect-square rounded-xl border-2 transition-all duration-200 p-2 relative group
                      ${getRarityBorder(item.rarity, isUnlocked, isSelected)}
                      ${getItemBackground(item)}
                      ${isUnlocked ? 'cursor-pointer transform hover:scale-105' : 'cursor-not-allowed opacity-50'}
                    `}
                    title={isUnlocked ? item.name : `Unlock at ${item.xpRequired} XP`}
                  >
                    {/* Item Content */}
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className={`text-2xl mb-1 transition-all duration-200 ${
                        isUnlocked ? 'transform group-hover:scale-110' : 'grayscale opacity-50'
                      }`}>
                        {isUnlocked ? item.emoji : '🔒'}
                      </div>
                      
                      {/* XP Requirement for locked items */}
                      {!isUnlocked && (
                        <div className="text-xs text-slate-400 font-bold">
                          {item.xpRequired}
                        </div>
                      )}
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        </svg>
                      </div>
                    )}

                    {/* Rarity indicator */}
                    {isUnlocked && (
                      <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ${
                        item.rarity === 'common' ? 'bg-gray-400' :
                        item.rarity === 'rare' ? 'bg-blue-400' :
                        'bg-yellow-400'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress Info */}
            <div className="text-center space-y-2">
              <div className="text-sm text-slate-300">
                Items Unlocked: {gridItems.filter(item => isItemUnlocked(item)).length}/{gridItems.length}
              </div>
              
              {/* Next unlock preview */}
              {(() => {
                const nextItem = gridItems
                  .filter(item => !isItemUnlocked(item))
                  .sort((a, b) => a.xpRequired - b.xpRequired)[0];
                
                if (nextItem) {
                  return (
                    <div className="text-xs text-slate-400">
                      Next unlock: {nextItem.name} at {nextItem.xpRequired} XP 
                      <span className="text-blue-400">
                        ({nextItem.xpRequired - userXP} XP needed)
                      </span>
                    </div>
                  );
                }
                return <div className="text-xs text-green-400">All items unlocked! 🎉</div>;
              })()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700/50 p-4 bg-slate-900/80">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Online & Ready</span>
            </div>
            <div>
              Selected: {Object.values(selectedItems).filter(Boolean).length} items
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlidingTaskbar;