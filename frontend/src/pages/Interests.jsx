import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import config from '../config';

export default function Interests() {
    const navigate = useNavigate();
    const [selectedInterests, setSelectedInterests] = useState(['Web Development']);
    const [skillLevel, setSkillLevel] = useState('intermediate');

    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await fetch(`${config.API_URL}/api/users/interests`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInterests(data.map(i => i.name));
                }
            } catch (err) {
                console.error("Failed to fetch interests:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterests();
    }, []);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const { user } = useAuth();

    const handleNext = async () => {
        if (!user) {
            console.error("User not found");
            return;
        }
        try {
            const res = await fetch(`${config.API_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    interests: selectedInterests,
                    skillLevel
                })
            });

            if (res.ok) {
                navigate('/gamified-journey');
            } else {
                console.error("Failed to update interests");
                alert("Failed to save interests. Please try again.");
            }
        } catch (err) {
            console.error("Error updating interests:", err);
            alert("An error occurred. Please check your connection.");
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 font-display bg-[#f6f8f6] dark:bg-black transition-colors duration-300">
            <ThemeToggle />
            <div className="w-full max-w-2xl mt-16">
                
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center justify-between gap-6">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Step 2 of 3</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className="h-2 rounded-full bg-[#13ec5b]" style={{ width: '66%' }}></div>
                    </div>
                </div>

                
                <div className="flex flex-wrap justify-between gap-3 p-4 pt-8">
                    <div className="flex w-full flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">What are you excited to learn?</h1>
                        <p className="text-base font-normal text-slate-600 dark:text-[#92c9a4]">Select a few topics to personalize your learning roadmap.</p>
                    </div>
                </div>

                
                <div className="flex flex-col gap-4 p-4">
                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">Choose your interests</h3>
                    <div className="flex flex-wrap gap-3">
                        {interests.map((interest) => (
                            <button
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`flex h-10 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg px-4 py-2 transition-transform duration-200 hover:scale-105 ${selectedInterests.includes(interest)
                                    ? 'bg-[#13ec5b]/20 ring-2 ring-[#13ec5b] dark:bg-[#13ec5b]/30'
                                    : 'bg-slate-200 ring-1 ring-inset ring-transparent hover:bg-slate-300 dark:bg-[#23482f] dark:hover:bg-[#326744]'
                                    }`}
                            >
                                <p className={`text-sm font-medium text-center w-full ${selectedInterests.includes(interest) ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-white'}`}>
                                    {interest}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                
                <div className="flex flex-col gap-4 p-4 pt-8">
                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">What's your current skill level?</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                            <label key={level} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${skillLevel === level
                                ? 'border-[#13ec5b] bg-[#13ec5b]/10 ring-2 ring-[#13ec5b] dark:bg-[#13ec5b]/20'
                                : 'border-slate-300 dark:border-slate-700'
                                }`}>
                                <input
                                    className="h-4 w-4 border-slate-400 text-[#13ec5b] focus:ring-[#13ec5b] dark:border-slate-600 dark:bg-slate-800 accent-[#13ec5b]"
                                    name="skill-level"
                                    type="radio"
                                    value={level}
                                    checked={skillLevel === level}
                                    onChange={() => setSkillLevel(level)}
                                />
                                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                
                <div className="mt-8 flex flex-col-reverse sm:flex-row items-center gap-4 p-4 mb-8">
                    <button
                        onClick={handleNext}
                        className="h-12 w-full rounded-lg bg-[#13ec5b] px-6 text-base font-bold text-[#102216] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>

                </div>
            </div>
        </div>
    );
}
