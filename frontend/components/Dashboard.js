// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Goals from './Goals'; // Assuming Goals.js exists and is functional
import Sprite from './Sprite';
import Challenges from './Challenges';

const Dashboard = () => {
    const [totalXP, setTotalXP] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch the total XP from the backend
    const fetchTotalXP = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/total-xp');

            // Ensure totalXP is a number, default to 0 if not
            const fetchedXP = typeof response.data.totalXP === 'number'
                               ? response.data.totalXP
                               : 0;

            setTotalXP(fetchedXP);
            console.log('Fetched totalXP:', fetchedXP);
        } catch (err) {
            console.error('Failed to fetch XP:', err);
            setTotalXP(0); // Reset XP on error
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle XP updates from child components (specifically Challenges)
    // This function will be passed down as a prop to Challenges.
    const handleXPUpdate = (newXP) => {
        setTotalXP(newXP);
        console.log('Dashboard received new total XP:', newXP);
    };

    // Fetch total XP when the component mounts
    useEffect(() => {
        fetchTotalXP();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="flex flex-col lg:flex-row p-4 min-h-screen bg-gray-900 text-white gap-4">
            <div className="lg:w-1/3 p-2">
                {/* Assuming Goals component handles its own XP updates or triggers a refresh */}
                <Goals onGoalComplete={fetchTotalXP} />
            </div>
            <div className="lg:w-1/3 p-2">
                {/* Pass the handleXPUpdate function to Challenges */}
                <Challenges onXPUpdate={handleXPUpdate} />
            </div>
            <div className="lg:w-1/3 p-2">
                {/* Pass the totalXP and isLoading state to Sprite */}
                <Sprite totalXP={totalXP} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Dashboard;