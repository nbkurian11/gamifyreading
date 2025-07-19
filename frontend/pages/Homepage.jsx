import React from 'react'
import LeaderboardComponent from "../components/LeaderboardComponent.jsx"
import Taskbar from '../components/Taskbar.jsx'
import CurrentRead from '../components/CurrentRead.jsx'
import Goals from '../components/Goals.jsx'
import Challenges from '../components/Challenges.jsx'
import Sprite from '../components/Sprite.jsx'
const Homepage = () => {
  return (
    
  <div className="grid grid-cols-7 grid-rows-5 gap-4 min-h-screen">
      <div className="row-span-5 bg-red-600">
        <Taskbar/>
      </div>
      
      <div className="col-span-2 row-span-5 bg-blue-300">
        <CurrentRead/>  
      </div>
      
      <div className="col-span-2 row-span-5 col-start-4 bg-amber-200">
        <Goals/>
      </div>
      <div className="col-span-2 row-span-3 col-start-6 bg-amber-800">
        <Challenges/>
      </div>
      <div className="col-span-2 row-span-2 col-start-6 row-start-4 bg-amber-950">
        <Sprite/>
      </div>
  </div>
    
  )
}

export default Homepage
