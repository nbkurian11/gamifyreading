// Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Goals from './Goals';
import Sprite from './Sprite';

const Dashboard = () => {
    const [totalXP, setTotalXP] = useState(0); // Initialize with 0
    const [isLoading, setIsLoading] = useState(true);

    const fetchTotalXP = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/total-xp');
            
            // --- IMPORTANT FIX HERE ---
            // Ensure totalXP is a number, default to 0 if not
            const fetchedXP = typeof response.data.totalXP === 'number' 
                              ? response.data.totalXP 
                              : 0; // Default to 0 if not a number

            setTotalXP(fetchedXP);
            console.log('Fetched totalXP:', fetchedXP); // For debugging
            // --- END IMPORTANT FIX ---

        } catch (err) {
            console.error('Failed to fetch XP:', err);
            setTotalXP(0); // Reset to 0 on error to prevent NaN
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalXP();
    }, []);

    return (
        <div className="flex flex-col md:flex-row p-4 min-h-screen bg-gray-900 text-white">
            <div className="md:w-1/2 p-2">
                <Goals onGoalComplete={fetchTotalXP} />
            </div>
            <div className="md:w-1/2 p-2">
                <Sprite totalXP={totalXP} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Dashboard;