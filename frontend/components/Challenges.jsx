import React, { useState, useEffect } from 'react';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); // For custom notifications

  // Sample difficulty levels and their XP rewards
  const difficultyLevels = {
    'Beginner': { xp: 50, color: 'bg-green-500' },
    'Intermediate': { xp: 100, color: 'bg-yellow-500' },
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
      // API key is left empty as per instructions for Canvas to provide it
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{
          parts: [{
            text: `Generate 5 challenging reading goals for a gamified reading app. Each challenge should include:
            1. A specific genre or topic for a book recommendation (e.g., "classic philosophy", "rich fantasy story", "historical fiction about WWII", "current popular books")
            2. A difficulty level (Beginner, Intermediate, Advanced, Expert, Master)
            3. A brief description of why it's challenging
            4. A time frame for completion
            
            Format as JSON array with objects containing: title, difficulty, description, timeFrame, bookTopic
            
            Example: 
            {
              "title": "Philosophy Deep Dive",
              "difficulty": "Expert",
              "description": "Read a complex philosophical work to expand critical thinking",
              "timeFrame": "30 days",
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
                timeFrame: { type: "STRING" },
                bookTopic: { type: "STRING" } // Changed from bookSuggestion to bookTopic
              },
              required: ["title", "difficulty", "description", "timeFrame", "bookTopic"]
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
      timeFrame: "45 days",
      bookTopic: "classic literature" // Changed to topic
    },
    {
      title: "Science Deep Dive",
      difficulty: "Expert",
      description: "Read a challenging scientific text to expand your knowledge",
      timeFrame: "30 days",
      bookTopic: "quantum physics" // Changed to topic
    },
    {
      title: "Poetry Challenge",
      difficulty: "Intermediate",
      description: "Explore the nuances of modern poetry",
      timeFrame: "20 days",
      bookTopic: "modern poetry" // Changed to topic
    },
    {
      title: "Historical Epic",
      difficulty: "Advanced",
      description: "Immerse yourself in a comprehensive historical account",
      timeFrame: "60 days",
      bookTopic: "world war history" // Changed to topic
    },
    {
      title: "Philosophy Introduction",
      difficulty: "Beginner",
      description: "Start your philosophical journey with an accessible text",
      timeFrame: "21 days",
      bookTopic: "introduction to philosophy" // Changed to topic
    }
  ];

  // Complete a challenge and award XP
  const completeChallenge = (challenge, index) => {
    const xpAwarded = difficultyLevels[challenge.difficulty]?.xp || 0; // Default to 0 if difficulty not found
    const newXP = userXP + xpAwarded;
    const newCompleted = [...completedChallenges, { ...challenge, completedDate: new Date().toISOString() }];
    
    setUserXP(newXP);
    setCompletedChallenges(newCompleted);
    
    // Save to localStorage
    localStorage.setItem('userXP', JSON.stringify(newXP));
    localStorage.setItem('completedChallenges', JSON.stringify(newCompleted));
    
    // Remove completed challenge from active challenges
    const updatedChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(updatedChallenges);
    
    // Show success message using custom notification
    showNotification(`Challenge completed! +${xpAwarded} XP earned. Total XP: ${newXP}`, 'success');
  };

  return (
    <div className="h-full p-4 bg-amber-800 text-white overflow-auto font-inter">
      {/* Notification Message */}
      {notification.message && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm 
          ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white transition-opacity duration-300`}>
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Reading Challenges</h2>
        <div className="text-sm bg-amber-900 px-3 py-1 rounded-full">
          XP: {userXP}
        </div>
      </div>
      
      <button 
        onClick={generateChallenges}
        disabled={loading}
        className="w-full mb-4 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-900 px-4 py-2 rounded-lg transition-colors shadow-md"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </div>
        ) : 'Generate New Challenges'}
      </button>

      {error && (
        <div className="mb-4 p-2 bg-red-600 text-white rounded text-sm shadow-md">
          {error}
        </div>
      )}
      
      <div className="space-y-3">
        {challenges.map((challenge, index) => (
          <div key={index} className="bg-amber-900 p-3 rounded-lg shadow-md border border-amber-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base text-amber-100">{challenge.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyLevels[challenge.difficulty]?.color || 'bg-gray-500'} text-white font-medium`}>
                  {challenge.difficulty}
                </span>
                <span className="text-sm text-amber-200 font-bold">
                  +{difficultyLevels[challenge.difficulty]?.xp || 0} XP
                </span>
              </div>
            </div>
            
            <p className="text-sm text-amber-200 mb-2">{challenge.description}</p>
            
            <div className="text-sm mb-2 text-amber-300">
              <strong>Book:</strong> {challenge.bookSuggestion || 'Fetching book...'}
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-amber-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {challenge.timeFrame}
              </span>
              <button 
                onClick={() => completeChallenge(challenge, index)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition-colors shadow-md transform hover:scale-105"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
        
        {challenges.length === 0 && !loading && (
          <div className="text-center text-amber-200 text-sm py-8">
            Click "Generate New Challenges" to get started!
          </div>
        )}
      </div>

      {completedChallenges.length > 0 && (
        <div className="mt-6 pt-4 border-t border-amber-700">
          <h3 className="text-lg font-bold mb-3 text-amber-100">Completed Challenges ({completedChallenges.length})</h3>
          <div className="space-y-2">
            {/* Displaying last 5 completed challenges */}
            {completedChallenges.slice(-5).reverse().map((challenge, index) => (
              <div key={index} className="bg-green-800 p-3 rounded-lg flex justify-between items-center shadow-md">
                <div>
                  <div className="font-semibold text-sm text-green-100">{challenge.title}</div>
                  <div className="text-green-200 text-xs">Completed on: {new Date(challenge.completedDate).toLocaleDateString()}</div>
                </div>
                <div className="text-green-200 text-sm font-bold">+{difficultyLevels[challenge.difficulty]?.xp || 0} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
