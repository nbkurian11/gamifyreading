import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); // For custom notifications

  
  // Sample difficulty levels and their XP rewards
  const difficultyLevels = {
    'Beginner': { xp: 50, color: 'bg-emerald-500' },
    'Intermediate': { xp: 100, color: 'bg-amber-500' },
    'Advanced': { xp: 200, color: 'bg-orange-500' },
    'Expert': { xp: 350, color: 'bg-red-500' },
    'Master': { xp: 500, color: 'bg-purple-500' }
  };

  // Load saved data from memory on component mount
  useEffect(() => {
    const savedXP = JSON.parse(localStorage.getItem('userXP') || '0');
    const savedCompleted = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    setUserXP(savedXP);
    setCompletedChallenges(savedCompleted);
  }, []);

  // Function to display custom notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000); // Notification disappears after 3 seconds
  };

  // Function to fetch a book suggestion from Google Books API
  const fetchBookSuggestion = async (query) => {
    try {
      // Use Google Books API to find a relevant book
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&langRestrict=en`);
      if (!response.ok) {
        throw new Error('Failed to fetch book suggestion');
      }
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        return `${book.title}${book.authors ? ' by ' + book.authors.join(', ') : ''}`;
      }
      return `A relevant book on ${query}`; // Fallback if no specific book found
    } catch (error) {
      console.error('Error fetching book suggestion:', error);
      return `A challenging book on ${query}`; // Fallback on error
    }
  };

  // Generate challenges using Gemini API
  const generateChallenges = async () => {
    setLoading(true);
    setError('');
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{
          parts: [{
            text: `Generate 5 challenging reading goals for a gamified reading app. Each challenge should include:
            1. A specific genre or topic for a book recommendation (e.g., "classic philosophy", "rich fantasy story", "historical fiction about WWII", "current popular books")
            2. A difficulty level (Beginner, Intermediate, Advanced, Expert, Master)
            3. A brief description of why it's challenging
            
            Format as JSON array with objects containing: title, difficulty, description, bookTopic
            
            Example: 
            {
              "title": "Philosophy Deep Dive",
              "difficulty": "Expert",
              "description": "Read a complex philosophical work to expand critical thinking",
              "bookTopic": "Existentialist philosophy"
            }`
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
                title: { type: "STRING" },
                difficulty: { type: "STRING", enum: ["Beginner", "Intermediate", "Advanced", "Expert", "Master"] },
                description: { type: "STRING" },
                bookTopic: { type: "STRING" } // Changed from bookSuggestion to bookTopic
              },
              required: ["title", "difficulty", "description", "bookTopic"]
            }
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      let parsedChallenges = [];
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        try {
          // The response is already JSON due to responseMimeType and responseSchema
          parsedChallenges = JSON.parse(result.candidates[0].content.parts[0].text);
        } catch (parseError) {
          console.error("Error parsing JSON from Gemini:", parseError);
          setError('Failed to parse challenges from Gemini. Using default challenges.');
          parsedChallenges = getFallbackChallenges();
        }
      } else {
        setError('No challenges returned from Gemini. Using default challenges.');
        parsedChallenges = getFallbackChallenges();
      }

      // Fetch actual book suggestions for each challenge
      const challengesWithBooks = await Promise.all(parsedChallenges.map(async (challenge) => {
        const bookSuggestion = await fetchBookSuggestion(challenge.bookTopic);
        return { ...challenge, bookSuggestion }; // Add the fetched book suggestion
      }));

      setChallenges(challengesWithBooks);

    } catch (error) {
      console.error('Error generating challenges:', error);
      setError(`Failed to generate challenges: ${error.message}. Using default challenges.`);
      // Generate fallback challenges and then fetch books for them
      const fallback = getFallbackChallenges();
      const fallbackWithBooks = await Promise.all(fallback.map(async (challenge) => {
        const bookSuggestion = await fetchBookSuggestion(challenge.bookTopic);
        return { ...challenge, bookSuggestion };
      }));
      setChallenges(fallbackWithBooks);
    } finally {
      setLoading(false);
    }
  };

  // Fallback challenges if API fails or parsing fails
  const getFallbackChallenges = () => [
    {
      title: "Classic Literature Marathon",
      difficulty: "Advanced",
      description: "Tackle a renowned classic that's known for its complexity",

      bookTopic: "classic literature" // Changed to topic
    },
    {
      title: "Science Deep Dive",
      difficulty: "Expert",
      description: "Read a challenging scientific text to expand your knowledge",

      bookTopic: "quantum physics" // Changed to topic
    },
    {
      title: "Poetry Challenge",
      difficulty: "Intermediate",
      description: "Explore the nuances of modern poetry",

      bookTopic: "modern poetry" // Changed to topic
    },
    {
      title: "Historical Epic",
      difficulty: "Advanced",
      description: "Immerse yourself in a comprehensive historical account",

      bookTopic: "world war history" // Changed to topic
    },
    {
      title: "Philosophy Introduction",
      difficulty: "Beginner",
      description: "Start your philosophical journey with an accessible text",

      bookTopic: "introduction to philosophy" // Changed to topic
    }
  ];

  // Complete a challenge and award XP
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    const id = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', id);
    return id;
  });

  // Load completed challenges from DB
  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/completed-challenges/${userId}`);
        setCompletedChallenges(data);
        
        // Calculate XP from completed challenges
        const totalXP = data.reduce((sum, challenge) => sum + challenge.xp, 0);
        setUserXP(totalXP);
        
        // Save to localStorage for offline use
        localStorage.setItem('userXP', JSON.stringify(totalXP));
        localStorage.setItem('completedChallenges', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to load completed challenges:', error);
        // Fallback to localStorage if API fails
        const savedXP = JSON.parse(localStorage.getItem('userXP') || '0');
        const savedCompleted = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        setUserXP(savedXP);
        setCompletedChallenges(savedCompleted);
      }
    };
    
    fetchCompletedChallenges();
  }, [userId]);

  // Complete a challenge and save to DB
  const completeChallenge = async (challenge, index) => {
    const xpAwarded = difficultyLevels[challenge.difficulty]?.xp || 0;
    
    try {
      await axios.post('http://localhost:5000/api/completed-challenges', {
        userId,
        ...challenge,
        xp: xpAwarded,
        completedDate: new Date()
      });

      const newCompleted = [...completedChallenges, {
        ...challenge,
        xp: xpAwarded,
        completedDate: new Date().toISOString()
      }];
      
      setCompletedChallenges(newCompleted);
      setUserXP(userXP + xpAwarded);

      const updatedChallenges = challenges.filter((_, i) => i !== index);
      setChallenges(updatedChallenges);

      localStorage.setItem('userXP', JSON.stringify(userXP + xpAwarded));
      localStorage.setItem('completedChallenges', JSON.stringify(newCompleted));
      
      showNotification(`Challenge completed! +${xpAwarded} XP earned. Total XP: ${userXP + xpAwarded}`, 'success');
    } catch (error) {
      console.error('Failed to save challenge:', error);
      showNotification('Failed to save challenge. Using local storage instead', 'error');

      const newXP = userXP + xpAwarded;
      const newCompleted = [...completedChallenges, { 
        ...challenge, 
        completedDate: new Date().toISOString(),
        xp: xpAwarded
      }];
      
      setUserXP(newXP);
      setCompletedChallenges(newCompleted);
      
      localStorage.setItem('userXP', JSON.stringify(newXP));
      localStorage.setItem('completedChallenges', JSON.stringify(newCompleted));
      
      const updatedChallenges = challenges.filter((_, i) => i !== index);
      setChallenges(updatedChallenges);
    }
  };

  return (
    <div className="min-h-full w-full max-w-full bg-[#B17039] from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden rounded-2xl">
      {/* Notification Message */}
      {notification.message && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm border text-sm font-medium
          ${notification.type === 'success' ? 'bg-emerald-500/90 border-emerald-400/50' : 'bg-red-500/90 border-red-400/50'} 
          text-white transition-all duration-300 animate-pulse`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-10 ">
        {/* Header Section */}
        <div className=" sm:justify-between sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-primary text-[#FBF3E9] text-center">
              Mega Challenges 🎉
            </h2>
            <p className="text-[#FBF3E9] font-secondary text-lg text-center">Level up your reading journey!</p>
          </div>
          {/* <div className="flex items-center gap-3"> */}
            {/* <div className="bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-bold text-white">{userXP.toLocaleString()} XP</span>
              </div>
            </div> */}
          {/* </div> */}
        </div>
        
        {/* Generate Button */}
        <button 
          onClick={generateChallenges}
          disabled={loading}
          className="w-full mb-6 bg-[#90A844] hover:from-[#90A844]
                   disabled:from-slate-700 disabled:to-slate-600 px-6 py-4 rounded-4xl transition-all duration-300 
                   shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed
                   border border-blue-500/20 hover:border-blue-400/40"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-semibold">Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span className="font-semibold font-secondary">Generate New Challenges</span>
            </div>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Active Challenges */}
        <div class="h-80 overflow-y-auto p-3 rounded-lg">
          <div className="space-y-4 mb-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-[#613918]/50 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-700/50 
                                        hover:bg-[#301204]/70 transition-all duration-300 hover:border-slate-600/50 
                                        hover:shadow-2xl hover:transform hover:scale-[1.02]">
                <div className="sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <h3 className="font-bold text-lg text-slate-100 flex-1 min-w-0">{challenge.title}</h3>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full ${difficultyLevels[challenge.difficulty]?.color || 'bg-gray-500'} 
                                    text-white font-semibold shadow-lg`}>
                      {challenge.difficulty}
                    </span>
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 
                                  px-3 py-1 rounded-full">
                      <span className="text-sm text-[#A5FC83] font-bold">
                        +{difficultyLevels[challenge.difficulty]?.xp || 0} XP
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">{challenge.description}</p>
                
                <div className="bg-slate-900/30 p-4 rounded-lg mb-4 border border-slate-700/30">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-[#F8F3E8] uppercase tracking-wide">Recommended Book</span>
                      <p className="text-sm text-slate-200 mt-1 break-words">
                        {challenge.bookSuggestion || (
                          <span className="text-slate-400 italic">Fetching recommendation...</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:justify-between sm:items-center gap-4">
                  <div className="items-center gap-2 text-slate-400">
                    <span className="text-sm">{challenge.timeFrame}</span>
                  </div>
                  <button 
                    onClick={() => completeChallenge(challenge, index)}
                    className="bg-[#90A844] hover:from-emerald-600 hover:to-green-600 
                            px-6 py-2.5 rounded-3xl text-sm font-semibold transition-all duration-200 shadow-lg 
                            hover:shadow-xl transform hover:scale-105 flex items-center gap-2 justify-center w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Complete Challenge
                  </button>
                </div>
              </div>
            ))}
            
            {challenges.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="bg-[#613918]/30 rounded-xl p-8 border border-[#301204]/30">
                  <svg className="w-16 h-16 text-[#F8F3E8] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <p className="text-[#F8F3E8]/80 text-lg">Ready to start your reading adventure?</p>
                  <p className="text-[#F8F3E8]/60 text-sm mt-2">Click "Generate New Challenges" to begin!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className="border-t border-slate-700/50 pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-100">
              <div className="bg-[#90A844] p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              Completed Challenges
              <span className="bg-[#2A8804]/20 text-[#F8F3E8] text-sm px-3 py-1 rounded-full border border-[#90A844]/30">
                {completedChallenges.length}
              </span>
            </h3>
            <div className="grid gap-4">
              {completedChallenges.slice(-5).reverse().map((challenge, index) => (
                <div key={index} className="bg-[#2A8804]/10 border border-[#2A8804]/20 p-4 rounded-xl 
                                           backdrop-blur-sm hover:bg-emerald-500/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-emerald-100 mb-1">{challenge.title}</div>
                      <div className="text-[#A5FC83]/90 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Completed: {new Date(challenge.completedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-[#2A8804]/30 border border-[#2A8804]/40 text-[#F8F3E8] text-sm font-bold 
                                  px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      +{difficultyLevels[challenge.difficulty]?.xp || 0} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;