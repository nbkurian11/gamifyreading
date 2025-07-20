import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardComponent from "./LeaderboardComponent.jsx";
import CurrentRead from '../components/CurrentRead.jsx';
import Goals from '../components/Goals.jsx';
import Challenges from '../components/Challenges.jsx';
import Sprite from '../components/Sprite.jsx';
import Taskbar from '../components/Taskbar.jsx';

// ✅ Header component
const Header = () => {
  return (
    <header className="w-full bg-[#FAF8F2]">
      <div className=" max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 items-center">
        {/* Logo (left) */}
        <div className="text-2xl font-primary text-[#D3B7A0]">SproutTale</div>

        {/* Links (right) */}
        <nav className="justify-self-end space-x-6">
          <a href="/about" className="text-[#88572E] hover:text-[#43A81B] font-secondary">
            About Us
          </a>
          <a href="/account" className="text-[#88572E] hover:text-[#43A81B] font-secondary">
            Account
          </a>
        </nav>
      </div>
    </header>
  );
};

// ✅ Main homepage
const Homepage = () => {
  const [userXP, setUserXP] = useState(350);
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    console.log('Navigating to:', route);

    if (route === '/leaderboard') {
      navigate('/leaderboard', { replace: true });
    } else {
      navigate(route);
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header /> {/* ✅ Add your header here */}
      <Taskbar userXP={userXP} onNavigate={handleNavigation} />

      <div className="bg-gradient-to-b from-[#FAF8F2] to-[#F4DFC2]  grid grid-cols-7 grid-rows-4 gap-x-8 gap-y-3 min-h-screen pt-10 pb-10 pr-50 pl-50">
        <div className="col-span-3 row-span-2 rounded-2xl">
          <CurrentRead />  
        </div>

        <div className="col-span-2 row-span-4 col-start-4">
          <Goals />
        </div>

        <div className="col-span-2 row-span-3 col-start-6">
          <Challenges />
        </div>

        <div className="col-span-3 row-span-1 col-start-1 row-start-3">
          <Sprite />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
