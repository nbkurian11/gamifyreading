// App.jsx
import { Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/UserLogin'
import HomePage from '../pages/Homepage.jsx'
import LeaderboardComponent from '../pages/LeaderboardComponent.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/leaderboard" element={<LeaderboardComponent />} />
    </Routes>
  )
}

export default App
