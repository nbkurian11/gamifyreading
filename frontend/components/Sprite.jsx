import React from 'react';

const Sprite = () => {
  return (
    <div className="flex bg-[#1a2232] text-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto mt-10">
      
      <div className="w-1/3 space-y-4">
        
        <div>
          <h2 className="text-2xl font-bold">CAT</h2>
          <p className="text-yellow-400 text-xl font-bold">Level 58</p>
        </div>

        
        <div>
          <p className="text-sm text-gray-300 mb-1">Progress</p>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 w-3/5"></div> 
          </div>
        </div>

        
        <div>
          <button className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition">
            Add Pages
          </button>
        </div>

        
        <div>
          <p className="text-sm text-gray-300">Read more to level up your pet!</p>
          
        </div>
      </div>

      
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
