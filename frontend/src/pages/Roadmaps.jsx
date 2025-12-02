import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Layout from '../components/Layout';
import config from '../config';

const Roadmaps = () => {
    const { user } = useAuth();
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${config.API_URL}/api/roadmaps`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRoadmaps(data);
                } else {
                    console.error('Failed to fetch roadmaps');
                }
            } catch (error) {
                console.error('Error fetching roadmaps:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmaps();
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto flex flex-col gap-10">


                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">Available Roadmaps</h1>
                        <p className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-relaxed max-w-2xl">
                            Choose a roadmap to start your learning journey. Each path is designed to take you from beginner to expert in a specific domain.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 hidden lg:flex">
                        <ThemeToggle fixedPosition={false} />
                    </div>
                </div>


                <section className="flex flex-col gap-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-zinc-400">Loading roadmaps...</p>
                        </div>
                    ) : roadmaps.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-zinc-400">No roadmaps available yet.</p>
                        </div>
                    ) : (
                        roadmaps.map((roadmap) => (
                            <div key={roadmap.id} className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-zinc-600 transition-all duration-300">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{roadmap.title}</h2>
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">{roadmap.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[#13ec5b] text-lg">layers</span>
                                                <span>{roadmap.skills?.length || 0} Skills</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[#13ec5b] text-lg">schedule</span>
                                                <span>{roadmap.estimatedTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col justify-start items-start sm:items-end gap-3 w-full sm:w-auto">
                                        {roadmap.status === 'completed' ? (
                                            <div className="flex min-w-[140px] w-full sm:w-auto items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400 text-sm font-bold leading-normal tracking-[0.015em]">
                                                <span className="material-symbols-outlined text-[#13ec5b] mr-2">check_circle</span>
                                                <span className="truncate">Completed</span>
                                            </div>
                                        ) : (
                                            <Link to={`/roadmap-details/${roadmap.id}`} className="flex min-w-[140px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#13ec5b] text-black text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#13ec5b]/90 transition-colors shadow-md hover:shadow-lg shadow-[#13ec5b]/20">
                                                <span className="truncate">{roadmap.status === 'in_progress' ? 'Resume' : 'Start Roadmap'}</span>
                                            </Link>
                                        )}
                                        <Link to={`/roadmap-details/${roadmap.id}`} className="flex min-w-[140px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
                                            <span className="truncate">View Details</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default Roadmaps;
