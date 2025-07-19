// App.jsx
import { Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/UserLogin'
import HomePage from '../pages/Homepage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  )
}

export default App
