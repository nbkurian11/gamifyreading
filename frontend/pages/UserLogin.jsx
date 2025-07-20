import React, { useState } from 'react';

const Header = () => {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 items-center">
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

const UserLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState(''); // State for login email
  const [password, setPassword] = useState(''); // State for login password
  const [username, setUsername] = useState(''); // State for register username
  const [registerEmail, setRegisterEmail] = useState(''); // State for register email
  const [registerPassword, setRegisterPassword] = useState(''); // State for register password

  // Function to redirect to the homepage
  const handleRedirect = () => {
    window.location.href = '/home'; // Redirects to the /home route
  };

  // Handles the login form submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    console.log('Login attempt with:', { email, password });
    // In a real application, you would send this data to your backend for authentication.
    // For now, it just logs and redirects.
    handleRedirect();
  };

  // Handles the registration form submission
  const handleRegister = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    console.log('Register attempt with:', { username, registerEmail, registerPassword });
    // In a real application, you would send this data to your backend to create a new user.
    // For now, it just logs and redirects.
    handleRedirect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F2] to-[#F4DFC2] px-4">
      <Header />

      {/* Main layout using responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto w-full gap-8 mt-5">

        {/* Left column: Contains the title, description, and login/register forms */}
        <div className="space-y-4 text-center">
          <div>
            {/* Image for "BookStar" - ensure 'bookstar.png' is in your public folder or accessible */}
            <img src="bookstar.png" className="mx-auto w-45 h-20" alt="BookStar Image" />
          </div>

<<<<<<< HEAD
          {/* Main title of the application */}
          <div className="text-8xl font-primary text-[#301204]">Gamify Reading</div>
=======
          <div className="text-8xl font-primary text-[#301204]">SproutTale</div>
>>>>>>> e0a67ee485e867ace9036c098974cebcfde8ab57

          {/* Tagline/description */}
          <div className="text-2xl font-secondary font-bold text-[#6E431F]">
            Level up as you read and watch your buddy grow!
          </div>

          <div className="p-6 rounded-xl w-full">
            {/* Tabs for switching between Login and Register forms */}
            <div className="grid grid-cols-2 mb-4 text-center">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2 font-semibold rounded-tl-lg rounded-tr-lg transition-colors duration-300 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[#43A81B] text-[#43A81B]'
                    : 'text-[#98673E] hover:text-[#6E431F]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 font-semibold rounded-tl-lg rounded-tr-lg transition-colors duration-300 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-[#43A81B] text-[#43A81B]'
                    : 'text-[#98673E] hover:text-[#6E431F]'
                }`}
              >
                Register
              </button>
            </div>

            {/* Conditional rendering of Login or Register forms based on activeTab state */}
            {activeTab === 'login' ? (
              <div className="space-y-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61] placeholder-[#C28D61]"
                  placeholder="Email address"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61] placeholder-[#C28D61]"
                  placeholder="Password"
                  required
                />
                <button
                  onClick={handleLogin} // Calls handleLogin on click
                  className="w-full py-3 px-4 bg-[#88572E] text-white font-semibold rounded-full hover:bg-[#2A8804] transition-colors duration-300"
                >
                  Log In
                </button>
                <div className="text-center">
                  <p className="text-xs text-[#98673E]">
                    "If you don't like to read, you haven't found the right book."
— J.K. Rowling


                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61] placeholder-[#C28D61]"
                  placeholder="Username"
                  required
                />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61] placeholder-[#C28D61]"
                  placeholder="Email address"
                  required
                />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61] placeholder-[#C28D61]"
                  placeholder="Password"
                  required
                />
                <button
                  onClick={handleRegister} // Calls handleRegister on click
                  className="w-full py-3 px-4 bg-[#88572E] text-white font-semibold rounded-full hover:bg-[#2A8804] transition-colors duration-300"
                >
                  Register
                </button>
                <div className="text-center">
                  <p className="text-xs text-[#98673E]">
                    "If you don't like to read, you haven't found the right book."
— J.K. Rowling
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Displays the creature image */}
        <div className="text-center">
          {/* Image for the creature - ensure 'creature.png' is in your public folder or accessible */}
          <img src="creature.png" className="mx-auto w-100 h-100 md:w-120 md:h-120 mt-10" alt="Creature Image" />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;