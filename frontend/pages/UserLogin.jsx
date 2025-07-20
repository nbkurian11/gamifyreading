import React, { useState } from 'react';

const Header = () => {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 items-center">
        {/* Logo (left) */}
        <div className="text-2xl font-primary text-[#D3B7A0]">Gamify</div>

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Always succeed regardless of input
    console.log('Login attempt with:', { email, password });
    
    // Redirect to homepage - adjust this path based on your routing setup
    // Option 1: If using React Router
    // navigate('/'); or navigate('/homepage');
    
    // Option 2: Simple redirect
    window.location.href = '/'; // or '/homepage' depending on your setup
    
    // Option 3: If you have a callback function to handle navigation
    // props.onLogin && props.onLogin();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Always succeed regardless of input
    console.log('Register attempt with:', { username, registerEmail, registerPassword });
    
    // Redirect to homepage after "registration"
    window.location.href = '/'; // or '/homepage' depending on your setup
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F2] to-[#F4DFC2] px-4">
      <Header />

      {/* Main layout using responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto w-full gap-8 mt-5">

        {/* Left column */}
        <div className="space-y-4 text-center">
          <div>
            <img src="bookstar.png" className="mx-auto w-45 h-20" alt="React Image" />
          </div>

          <div className="text-8xl font-primary text-[#301204]">Gamify Reading</div>

          <div className="text-2xl font-secondary font-bold text-[#6E431F]">
            Level up as you read and watch your buddy grow!
          </div>

          <div className="p-6 rounded-xl w-full">
            {/* Tabs */}
            <div className="grid grid-cols-2 mb-4 text-center">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-2 font-semibold ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[#43A81B] text-[#43A81B]'
                    : 'text-[#98673E]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`py-2 font-semibold ${
                  activeTab === 'register'
                    ? 'border-b-2 border-[#43A81B] text-[#43A81B]'
                    : 'text-[#98673E]'
                }`}
              >
                Register
              </button>
            </div>

            {/* Forms */}
            {activeTab === 'login' ? (
              <form className="space-y-5">
                <input
                  type="email"
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                  placeholder="Email address"
                />
                <input
                  type="password"
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                  placeholder="Password"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#88572E] text-white font-semibold rounded-4xl hover:bg-[#2A8804]"
                >
                  Log In
                </button>
              </form>
            ) : (
              <form className="space-y-4">
                <input
                  type="text"
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                  placeholder="Username"
                />
                <input
                  type="email"
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                  placeholder="Email address"
                />
                <input
                  type="password"
                  className="block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                  placeholder="Password"
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#88572E] text-white font-semibold rounded-4xl hover:bg-[#2A8804]"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="text-center">
          <img src="creature.png" className="mx-auto w-100 h-100 md:w-120 md:h-120 mt-10" alt="React Image" />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;