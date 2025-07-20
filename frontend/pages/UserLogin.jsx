import React, { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-around mb-4">
          <button
            onClick={() => setActiveTab('login')}
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === 'login'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`w-1/2 py-2 text-center font-semibold ${
              activeTab === 'register'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'login' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="********"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Log In
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Any email/password will work for testing
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="yourusername"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="********"
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Register
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Any details will work for testing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLogin;