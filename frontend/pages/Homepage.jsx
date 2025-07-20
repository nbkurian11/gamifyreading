import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import LeaderboardComponent from "./LeaderboardComponent.jsx";
import CurrentRead from '../components/CurrentRead.jsx';
import Goals from '../components/Goals.jsx';
import Challenges from '../components/Challenges.jsx';
import Sprite from '../components/Sprite.jsx';
import Taskbar from '../components/Taskbar.jsx';

const Homepage = () => {
  const [userXP, setUserXP] = useState(350);
  const navigate = useNavigate(); // Add this line

 const handleNavigation = (route) => {
  console.log('Navigating to:', route);
  
  // Force absolute navigation for leaderboard
  if (route === '/leaderboard') {
    navigate('/leaderboard', { replace: true });
  } else {
    navigate(route);
  }
};

  return (
    <div className="relative min-h-screen">
      <Taskbar 
        userXP={userXP} 
        onNavigate={handleNavigation} 
      /> 

      <div className="grid grid-cols-7 grid-rows-5 gap-4 min-h-screen bg-gradient-to-b from-[#FAF8F2] to-[#F4DFC2] p-4">
        <div className="col-span-3 row-span-5 bg-gradient-to-br from-[#0c0f1a] to-[#111827] rounded-2xl shadow-xl p-4">

          <CurrentRead />  
        </div>
        
        <div className="col-span-2 row-span-5 col-start-4">
          <Goals />
        </div>

        <div className="col-span-2 row-span-3 col-start-6">
          <Challenges />
        </div>
        
        <div className="col-span-2 row-span-2 col-start-6 row-start-4">
          <Sprite />
        </div>
      </div>
    </div>
  );
};

export default Homepage;