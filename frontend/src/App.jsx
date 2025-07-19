// App.jsx
import { Routes, Route } from 'react-router-dom'
import UserLogin from '../pages/UserLogin'
import HomePage from '../pages/Homepage.jsx'

function App() {
  return (
<<<<<<< HEAD
    <div className="text-4xl text-amber-500">
      <div>
        <UserLogin/>
      </div>
      
    </div>

=======
    <Routes>
      <Route path="/" element={<UserLogin />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
>>>>>>> 821ff5ec2a882a092cbb9ae2b0cab1a37473eec1
  )
}

export default App
