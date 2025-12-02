import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ThemeToggle from "../components/ThemeToggle";
import config from "../config";

export default function EditProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        bio: "",
        interests: [],
        newInterest: ""
    });

    const [availableInterests, setAvailableInterests] = useState([]);
    const [showInterestList, setShowInterestList] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const dashboardResponse = await fetch(`${config.API_URL}/api/dashboard`, { headers });
                if (dashboardResponse.ok) {
                    const data = await dashboardResponse.json();
                    const userData = data.user || user;

                    setFormData({
                        name: userData.name || "",
                        username: userData.username || (userData.email ? userData.email.split('@')[0] : ""),
                        email: userData.email || "",
                        bio: userData.bio || "",
                        interests: userData.interests || [],
                        newInterest: ""
                    });
                }

                const interestsResponse = await fetch(`${config.API_URL}/api/users/interests`, { headers });
                if (interestsResponse.ok) {
                    const interestsData = await interestsResponse.json();
                    console.log("Fetched available interests:", interestsData);
                    setAvailableInterests(interestsData.map(i => i.name));
                } else {
                    console.error("Failed to fetch interests:", interestsResponse.status);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'full-name' ? 'name' : id]: value
        }));
    };

    const addInterest = (interest) => {
        if (formData.interests.includes(interest)) return;
        setFormData(prev => ({
            ...prev,
            interests: [...prev.interests, interest]
        }));
        setShowInterestList(false);
    };

    const removeInterest = (interestToRemove) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(i => i !== interestToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    bio: formData.bio,
                    interests: formData.interests
                })
            });

            if (response.ok) {
                navigate('/settings');
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-slate-600 dark:text-zinc-400">Loading profile...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="absolute top-4 right-4 z-10 hidden lg:block">
                <ThemeToggle fixedPosition={false} />
            </div>
            <div className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-4xl flex-1">
                    <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
                        <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Edit Your Profile</h1>
                    </div>
                    <div className="bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 space-y-8 transition-colors duration-300">


                        <div className="flex p-4 border-b border-slate-200 dark:border-zinc-800 pb-8">
                            <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="relative">
                                        <div className="flex items-center justify-center rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                                            <span className="material-symbols-outlined text-5xl sm:text-6xl">person</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-slate-900 dark:text-white text-lg sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">{formData.name}</p>
                                        <p className="text-slate-500 dark:text-zinc-400 text-sm sm:text-base font-normal leading-normal">{formData.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-slate-800 dark:text-zinc-200 text-base font-medium leading-normal pb-2" htmlFor="full-name">Full Name</label>
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-4 text-base font-normal leading-normal transition-colors"
                                        style={{ height: '100px' }}
                                        id="full-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-slate-800 dark:text-zinc-200 text-base font-medium leading-normal pb-2" htmlFor="username">Username</label>
                                    <input
                                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-4 text-base font-normal leading-normal transition-colors"
                                        style={{ height: '100px' }}
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-slate-800 dark:text-zinc-200 text-base font-medium leading-normal pb-2" htmlFor="email">Email Address</label>
                                <input
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-500 dark:text-zinc-400 focus:outline-0 border border-slate-300 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 px-4 text-base font-normal leading-normal cursor-not-allowed transition-colors"
                                    style={{ height: '80px' }}
                                    disabled
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-slate-800 dark:text-zinc-200 text-base font-medium leading-normal pb-2" htmlFor="bio">Bio</label>
                                <textarea
                                    className="flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/20 min-h-[120px] placeholder:text-slate-400 dark:placeholder:text-zinc-500 p-4 text-base font-normal leading-normal transition-colors"
                                    id="bio"
                                    placeholder="Tell us a little about yourself..."
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-slate-800 dark:text-zinc-200 text-base font-medium leading-normal pb-2" htmlFor="interests">Interests</label>
                                <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-colors relative">
                                    {formData.interests.map((interest, index) => (
                                        <div key={index} className="flex items-center gap-1 bg-[#13ec5b]/20 text-[#13ec5b] px-3 py-1.5 rounded-full text-sm font-medium">
                                            <span>{interest}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeInterest(interest)}
                                                className="material-symbols-outlined !text-base hover:text-[#13ec5b]/80"
                                            >
                                                close
                                            </button>
                                        </div>
                                    ))}

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowInterestList(!showInterestList)}
                                            className="flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>

                                        {showInterestList && (
                                            <div className="absolute top-full left-0 mt-2 w-64 max-h-60 overflow-y-auto bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 z-50 p-2">
                                                <div className="sticky top-0 bg-white dark:bg-zinc-900 p-2 border-b border-slate-100 dark:border-zinc-800 mb-1 z-10">
                                                    <input
                                                        type="text"
                                                        placeholder="Search or add..."
                                                        className="w-full px-3 py-2 rounded-lg text-sm border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 focus:outline-none focus:border-[#13ec5b] text-slate-900 dark:text-white"
                                                        value={formData.newInterest}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, newInterest: e.target.value }))}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                if (formData.newInterest.trim()) {
                                                                    addInterest(formData.newInterest.trim());
                                                                    setFormData(prev => ({ ...prev, newInterest: "" }));
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {availableInterests.filter(i => !formData.interests.includes(i) && i.toLowerCase().includes(formData.newInterest.toLowerCase())).length > 0 ? (
                                                    availableInterests
                                                        .filter(i => !formData.interests.includes(i) && i.toLowerCase().includes(formData.newInterest.toLowerCase()))
                                                        .map((interest, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => addInterest(interest)}
                                                                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                                            >
                                                                {interest}
                                                            </button>
                                                        ))
                                                ) : (
                                                    formData.newInterest.trim() ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                addInterest(formData.newInterest.trim());
                                                                setFormData(prev => ({ ...prev, newInterest: "" }));
                                                            }}
                                                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#13ec5b] hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                                        >
                                                            Add "{formData.newInterest}"
                                                        </button>
                                                    ) : (
                                                        <p className="text-slate-500 dark:text-zinc-400 text-sm px-3 py-2">No matching interests.</p>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-zinc-800">
                                <button
                                    className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-transparent text-slate-800 dark:text-zinc-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                                    type="button"
                                    onClick={() => navigate('/settings')}
                                >
                                    <span className="truncate">Cancel</span>
                                </button>
                                <button
                                    className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-[#13ec5b] text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#13ec5b]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                >
                                    <span className="truncate">Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </Layout >
    );
}
