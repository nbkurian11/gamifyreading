import React, { useState } from 'react';

const Goals = () => {
  const [microChallenges, setMicroChallenges] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const apiKey = "AIzaSyAEnwruwQVnvi0n7G6zKxG6pr9mi0rN0eA";

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const generateMicroChallenges = async () => {
    if (microChallenges.length > 0) return;

    setLoading(true);
    setError('');

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{
          parts: [{
            text: `
Generate 5 micro reading challenges for a gamified reading app that are short-term and measurable (like "Read 30 pages", "Finish chapter 3"). 

Format as a JSON array with objects containing: task, description, xpReward, timeFrame.

Example:
[
  {
    "task": "Read 30 pages",
    "description": "Read 30 pages of your current book to build a daily habit",
    "xpReward": 10,
    "timeFrame": "2 days"
  }
]
`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                task: { type: "STRING" },
                description: { type: "STRING" },
                xpReward: { type: "NUMBER" },
                timeFrame: { type: "STRING" }
              },
              required: ["task", "description", "xpReward", "timeFrame"]
            }
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      let parsedChallenges = [];

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        parsedChallenges = JSON.parse(result.candidates[0].content.parts[0].text);
      } else {
        setError('No micro-challenges returned from Gemini.');
        showNotification('No micro-challenges returned from Gemini.', 'error');
      }

      setMicroChallenges(parsedChallenges);
    } catch (err) {
      console.error('Error generating micro challenges:', err);
      setError('Failed to generate micro challenges.');
      showNotification('Failed to generate micro challenges.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const completeGoal = (goalIndex) => {
    const completed = {
      ...microChallenges[goalIndex],
      completedDate: new Date().toLocaleDateString()
    };
    const updated = [...microChallenges];
    updated.splice(goalIndex, 1);
    setMicroChallenges(updated);
    setCompletedGoals([completed, ...completedGoals]);
  };

  const totalXP = completedGoals.reduce((acc, goal) => acc + goal.xpReward, 0);

  return (
    <div className="h-full p-6 bg-black text-white font-inter overflow-auto max-w-lg mx-auto rounded-3xl shadow-[0_0_15px_rgba(0,255,255,0.5)]">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.7)] text-sm
            ${notification.type === 'success' ? 'bg-cyan-600' : 'bg-red-600'} text-white`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-wide text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">Micro Reading Challenges</h2>
        <div className="text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-5 py-1 rounded-full select-none flex items-center gap-3 font-extrabold shadow-[0_0_15px_rgba(0,255,255,0.9)] text-white">
          <span>XP:</span> <span>{totalXP}</span>
        </div>
      </div>

      <button
        onClick={generateMicroChallenges}
        disabled={loading || microChallenges.length > 0}
        className="w-full mb-7 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-700 disabled:opacity-50 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,255,255,0.7)] transition-colors flex justify-center items-center font-bold text-white text-lg"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Micro Challenges'
        )}
      </button>

      {error && (
        <div className="mb-5 p-4 bg-red-700 rounded-xl text-white font-bold shadow-[0_0_10px_rgba(255,0,0,0.7)]">{error}</div>
      )}

      <ul className="space-y-6">
        {microChallenges.map((mc, idx) => (
          <li
            key={idx}
            className="p-6 bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 rounded-2xl border border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.8)]"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-extrabold text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.9)]">{mc.task}</h3>
              <span className="text-xl font-extrabold text-lime-400 drop-shadow-[0_0_8px_rgba(200,255,100,0.9)]">+{mc.xpReward} XP</span>
            </div>
            <p className="text-cyan-300 mb-4">{mc.description}</p>
            <div className="text-sm italic text-cyan-400 flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-300" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {mc.timeFrame}
            </div>
            <button
              onClick={() => completeGoal(idx)}
              className="bg-lime-600 hover:bg-lime-500 px-6 py-3 rounded-xl font-bold text-black shadow-[0_0_20px_rgba(180,255,100,0.9)] transition-colors"
            >
              Mark as Complete
            </button>
          </li>
        ))}
      </ul>

      {microChallenges.length === 0 && !loading && (
        <div className="text-center text-cyan-600 italic py-16 select-none drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
          Click "Generate Micro Challenges" to start.
        </div>
      )}

      {completedGoals.length > 0 && (
        <div className="mt-12 pt-8 border-t border-cyan-700">
          <h3 className="text-3xl font-extrabold mb-8 text-lime-400 drop-shadow-[0_0_15px_rgba(180,255,100,0.9)]">
            Completed Mini Goals ({completedGoals.length})
          </h3>
          <div className="flex flex-col gap-5">
            {completedGoals.map((goal, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-lime-900 to-lime-800 p-5 rounded-2xl shadow-[0_0_20px_rgba(180,255,100,0.9)] flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-lime-100 text-xl drop-shadow-[0_0_8px_rgba(180,255,100,0.9)]">{goal.task}</div>
                  <div className="text-lime-300 text-sm">Completed: {goal.completedDate}</div>
                </div>
                <div className="text-lime-200 font-extrabold text-2xl drop-shadow-[0_0_15px_rgba(180,255,100,0.9)]">+{goal.xpReward} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
