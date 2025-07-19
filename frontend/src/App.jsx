import React from 'react'
import LeaderboardComponent from '../components/LeaderboardComponent'
import UserLogin from '../components/UserLogin'
const App = () => {
  return (
    <div className="text-4xl text-amber-500">
      <UserLogin/>
      <LeaderboardComponent/>
    </div>
  )
}

export default App
