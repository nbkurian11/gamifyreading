import React, { useState} from 'react';
import axios from 'axios';

// The parent passes down the onGoalComplete function as a prop
const Goals = ({ onGoalComplete }) => {
    const [microChallenges, setMicroChallenges] = useState([]);
const [showCompleted, setShowCompleted] = useState(false);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    // State for user's personal XP (managed locally here)
    const [userXP, setUserXP] = useState(0);

    // Remove the totalXP state from here
    // const [totalXP, setTotalXP] = useState(0); 

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const MAX_IDEAS = 20;
    const canGenerateMore = microChallenges.length < MAX_IDEAS && !loading;

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const generateMicroChallenges = async (isAdditional = false) => {
        if (microChallenges.length >= MAX_IDEAS && isAdditional) {
            showNotification('Maximum of 12 ideas reached!', 'error');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [{
                        text: `
Generate ${isAdditional ? '3-5' : '5-7'} unique micro reading challenges for a gamified reading app that are short-term and measurable (like "Read 30 pages", "Finish chapter 3", "Read until you meet the antagonist in the book").
Make them diverse and creative. Avoid repetitive tasks. Keep it straightforward.
Format as a JSON array with objects containing: task, xpReward.
Example:
[
  {
    "task": "Read up to Chapter 30 in the book.",
    "xpReward": 10
  }
    {
    "task": "Meet the main antagonist of the book.",
    "xpReward": 15
  }
    {
    "task": "Read until a character laughs in the book.",
    "xpReward": 20
  }
]
`
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                task: { type: "STRING" },
                                xpReward: { type: "NUMBER" },
                            },
                            required: ["task", "xpReward"]
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
                return;
            }

            if (isAdditional) {
                const currentCount = microChallenges.length;
                const availableSlots = MAX_IDEAS - currentCount;
                const newChallenges = parsedChallenges.slice(0, availableSlots);
                setMicroChallenges([...microChallenges, ...newChallenges]);
                showNotification(`Added ${newChallenges.length} new challenges!`);
            } else {
                const limitedChallenges = parsedChallenges.slice(0, MAX_IDEAS);
                setMicroChallenges(limitedChallenges);
                showNotification(`Generated ${limitedChallenges.length} challenges!`);
            }
        } catch (err) {
            console.error('Error generating micro challenges:', err);
            setError('Failed to generate micro challenges.');
            showNotification('Failed to generate micro challenges.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const completeGoal = async (goalIndex) => {
        const completed = {
            ...microChallenges[goalIndex],
            completedDate: new Date().toLocaleDateString()
        };
        const xpReward = completed.xpReward;

        // Update UI immediately (local state)
        const updated = [...microChallenges];
        updated.splice(goalIndex, 1);
        setMicroChallenges(updated);
        setCompletedGoals([completed, ...completedGoals]);
        setUserXP(prev => prev + xpReward);

        // Call API to add XP to global total
        try {
            await axios.post('http://localhost:5000/api/add-xp', { xp: xpReward });
            showNotification(`Completed: ${completed.task}! +${xpReward} XP`);

            // This is the key part: tell the parent to update
            if (onGoalComplete) {
                onGoalComplete();
            }
        } catch (error) {
            console.error('Failed to add XP to global total:', error);
            showNotification('Completed goal but failed to add XP', 'error');
        }
    };

    return (
        <div className="h-auto p-10 bg-[#D89156] text-white font-secondary overflow-hidden max-w-lg mx-auto rounded-2xl">
  {/* Notification */}
  {notification.message && (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.7)] text-sm
        ${notification.type === 'success' ? 'bg-cyan-600' : 'bg-red-600'} text-white`}
    >
      {notification.message}
    </div>
  )}

  {/* Header */}
  <div className="mb-6">
    <div className="justify-between items-center mb-4">
      <h2 className="text-3xl font-primary text-[#FBF3E9] text-center">
        Micro Reading Challenges
      </h2>
    </div>

    <div className="">
      <button
        onClick={() => generateMicroChallenges(false)}
        disabled={loading}
        className="w-full mb-6 bg-[#90A844] hover:from-[#90A844]
        disabled:from-slate-700 disabled:to-slate-600 px-6 py-4 rounded-4xl transition-all duration-300 
        shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed
        border border-blue-500/20 hover:border-blue-400/40"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : microChallenges.length > 0 ? (
          'Decrease challenges'
        ) : (
          'Check your challenges!'
        )}
      </button>

      {microChallenges.length > 0 && (
        <button
          onClick={() => generateMicroChallenges(true)}
          disabled={!canGenerateMore}
          className="w-full mb-6 bg-[#90A844] hover:from-[#90A844]
          disabled:from-slate-700 disabled:to-slate-600 px-6 py-4 rounded-4xl transition-all duration-300 
          shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed
          border border-blue-500/20 hover:border-blue-400/40"
        >
          {microChallenges.length >= MAX_IDEAS ? 'Max Reached' : 'Add more challenges'}
        </button>
      )}
    </div>

    {microChallenges.length > 0 && (
      <div className="mt-3 text-center text-sm text-[#613918]">
        {microChallenges.length}/{MAX_IDEAS} challenges
      </div>
    )}
  </div>

  {/* ✅ SCROLLABLE Micro Challenges Section */}
  <div className="overflow-auto max-h-90 pr-1 mb-6">
    <div className="space-y-4">
      {error && (
        <div className="mb-5 p-4 bg-red-700 rounded-xl text-white font-bold shadow-[0_0_10px_rgba(255,0,0,0.7)]">
          {error}
        </div>
      )}

      {microChallenges.map((mc, idx) => (
        <div key={idx} className="p-5 bg-[#B17039] rounded-2xl">
          <div className="justify-between items-center mb-3">
            <h3 className="font-secondary text-md text-[#F8F3E8]">{mc.task}</h3>
            <span className="text-lg text-[#F8F3E8] font-secondary">
              +{mc.xpReward} XP
            </span>
          </div>
          <div className="text-xs italic text-cyan-400 flex items-center gap-2 mb-3">
            {mc.timeFrame}
          </div>
          <button
            onClick={() => completeGoal(idx)}
            className="w-full bg-[#90A844] hover:bg-[#2A8804] px-4 py-2 rounded-3xl font-secondary text-[#FBF3E9]"
          >
            Mark as Complete
          </button>
        </div>
      ))}

      {microChallenges.length === 0 && !loading && (
        <div className="text-center text-[#FBF3E9]/80 italic font-secondary">
          Click "Generate Challenges" to start.
        </div>
      )}
    </div>
  </div>

  {/* ✅ SCROLLABLE Completed Challenges Section (appears below) */}
  {/* ✅ DROPDOWN SCROLLABLE Completed Challenges Section */}
{completedGoals.length > 0 && (
  <div className="pt-6 border-t border-cyan-700">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-bold font-inter text-[#F8F3E8]">
        Completed Goals ({completedGoals.length})
      </h3>
      <button
        onClick={() => setShowCompleted(!showCompleted)}
        className="text-sm bg-[#90A844] hover:bg-[#2A8804] text-white px-3 py-1 rounded-xl transition"
      >
        {showCompleted ? 'Hide' : 'Show'}
      </button>
    </div>

    {/* ✅ Scrollable dropdown content */}
    {showCompleted && (
      <div className="overflow-auto max-h-64 pr-1 space-y-3 transition-all duration-300">
        {completedGoals.map((goal, idx) => (
          <div
            key={idx}
            className="bg-[#2A8804] p-4 rounded-2xl flex justify-between items-center"
          >
            <div>
              <div className="font-bold text-lime-100 text-lg">
                {goal.task}
              </div>
              <div className="text-[#F8F3E8] text-xs">Completed: {goal.completedDate}</div>
            </div>
            <div className="text-[#F8F3E8] font-extrabold text-xl">
              +{goal.xpReward} XP
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

</div>

    );
};

export default Goals;