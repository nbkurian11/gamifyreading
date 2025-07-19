import React, { useState } from 'react';

const Header = () => {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo (left) */}
        <div className="text-2xl font-primary text-[#D3B7A0]">Gamify</div>

        {/* Links (right) */}
        <nav className="space-x-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F2] to-[#F4DFC2] px-4 flex flex-col -mt-1000px">
      <Header />

      <div className="flex flex-1 max-w-7xl mx-auto items-center justify-center w-full -mt-5 gap-8">

        {/* Left column with 4 rows in the requested order */}
        <div className="flex flex-col flex-1 space-y-4 items-center text-center">
          {/* Row 1 */}
          <div>
            <img src="bookstar.png" className="w-45 h-20" alt="React Image"/>
          </div>

          {/* Row 2 - Title */}
          <div className="text-8xl font-primary text-[#301204]">Gamify Reading</div>

          {/* Row 3 - Description */}
          <div className="text-2xl font-secondary font-bold text-[#6E431F]">
            Level up as you read and watch your buddy grow!
          </div>

          {/* Row 4 - User Login / Register Form */}
          <div className="p-6 rounded-xl w-full">
            {/* Tabs */}
            <div className="flex justify-around mb-4">
              <button
                onClick={() => setActiveTab('login')}
                className={`w-1/2 py-2 text-center font-semibold ${
                  activeTab === 'login'
                    ? 'border-b-2 border-[#43A81B] text-[#43A81B]'
                    : 'text-[#98673E]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`w-1/2 py-2 text-center font-semibold ${
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
                <div>
                  <label className="block text-sm font-medium text-gray-700"></label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700"></label>
                  <input
                    type="password"
                    className="mt-1 block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full w-xs py-3 px-4 bg-[#88572E] text-white font-semibold rounded-4xl hover:bg-[#2A8804]"
                >
                  Log In
                </button>
              </form>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[gray-700]"></label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700"></label>
                  <input
                    type="email"
                    className="mt-1 block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700"></label>
                  <input
                    type="password"
                    className="mt-1 block w-full px-5 py-3 bg-[#FAF3E9] border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-[#43A81B] font-secondary text-[#C28D61]"
                    placeholder="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full w-xs py-3 px-4 bg-[#88572E] text-white font-semibold rounded-4xl hover:bg-[#2A8804]"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column: centered */}
        <div className="flex flex-col flex-1 items-center justify-center text-center">
          <div>
            <img src="creature.png" className="w-150 h-150" alt="React Image"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
