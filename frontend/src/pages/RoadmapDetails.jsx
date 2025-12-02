import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Layout from '../components/Layout';
import config from '../config';

const RoadmapDetails = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRoadmap = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/api/roadmaps/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRoadmap(data);
            } else {
                console.error('Failed to fetch roadmap');
            }
        } catch (error) {
            console.error('Error fetching roadmap:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchRoadmap();
        }
    }, [id, fetchRoadmap]);

    const handleStartRoadmap = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/api/roadmaps/${id}/start`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchRoadmap();
            }
        } catch (error) {
            console.error('Error starting roadmap:', error);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">Loading roadmap...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!roadmap) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">Roadmap not found.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-[#13ec5b] bg-[#13ec5b]/10 dark:bg-[#13ec5b]/20 px-2.5 py-1 rounded-full">Completed</span>;
            case 'in_progress':
                return <span className="text-xs font-semibold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/20 px-2.5 py-1 rounded-full">In Progress</span>;
            case 'locked':
                return <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-400/10 dark:bg-zinc-400/20 px-2.5 py-1 rounded-full">Locked</span>;
            default:
                return <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-400/10 dark:bg-zinc-400/20 px-2.5 py-1 rounded-full">Not Started</span>;
        }
    };

    const getStepIcon = (status, index, locked) => {
        if (status === 'completed') {
            return (
                <div className="flex items-center justify-center size-10 rounded-full bg-[#13ec5b] text-black">
                    <span className="material-symbols-outlined font-semibold">check</span>
                </div>
            );
        } else if (status === 'in_progress') {
            return (
                <div className="flex items-center justify-center size-10 rounded-full border-2 border-[#13ec5b] bg-[#f6f8f6] dark:bg-black">
                    <div className="size-3 rounded-full bg-[#13ec5b]"></div>
                </div>
            );
        } else if (locked) {
            return (
                <div className="flex items-center justify-center size-10 rounded-full border-2 border-slate-300 dark:border-zinc-600 bg-[#f6f8f6] dark:bg-black text-slate-500 dark:text-zinc-400">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center justify-center size-10 rounded-full border-2 border-slate-300 dark:border-zinc-600 bg-[#f6f8f6] dark:bg-black">
                    <span className="font-bold text-slate-500 dark:text-zinc-400">{index + 1}</span>
                </div>
            );
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto flex flex-col gap-10">

                
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-6 w-full">
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <Link className="text-sm font-medium text-[#13ec5b] hover:underline" to="/roadmaps">All Roadmaps</Link>
                            <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">/</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{roadmap.title}</span>
                        </div>

                        
                        <div className="flex flex-wrap justify-between items-start gap-6">
                            <div className="flex flex-col gap-3 max-w-2xl">
                                <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">{roadmap.title}</h1>
                                <p className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-relaxed">
                                    {roadmap.description}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Estimated time: {roadmap.estimatedTime}</p>
                            </div>
                            {roadmap.status === 'not_started' && (
                                <button
                                    onClick={handleStartRoadmap}
                                    className="flex min-w-[84px] max-w-[480px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#13ec5b] text-black text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#13ec5b]/90 transition-colors shadow-md hover:shadow-lg shadow-[#13ec5b]/20"
                                >
                                    <span className="truncate">Start Roadmap</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4 hidden lg:flex">
                        <ThemeToggle fixedPosition={false} />
                    </div>
                </div>

                
                <section className="grid grid-cols-[auto_1fr] gap-x-6">
                    {roadmap.skills && roadmap.skills.map((skillItem, index) => {
                        const isLast = index === roadmap.skills.length - 1;
                        const status = skillItem.status || 'not_started';
                        const locked = skillItem.locked || false;

                        return (
                            <React.Fragment key={skillItem.id}>
                                <div className="flex flex-col items-center gap-2">
                                    {getStepIcon(status, index, locked)}
                                    {!isLast && (
                                        <div className={`w-[2px] h-full ${status === 'completed' || status === 'in_progress'
                                            ? 'bg-[#13ec5b]/50'
                                            : 'bg-slate-300 dark:bg-zinc-600'
                                            }`}></div>
                                    )}
                                </div>
                                <div className={`pb-12 ${locked ? 'opacity-60 pointer-events-none' : ''}`}>
                                    <Link
                                        to={locked ? '#' : `/skill-details/${skillItem.skill.id}`}
                                        className={`block p-6 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm transition-all duration-300 ${!locked ? 'hover:shadow-lg hover:-translate-y-1' : ''} ${status === 'in_progress'
                                            ? 'border-2 border-[#13ec5b] shadow-lg shadow-[#13ec5b]/10 dark:shadow-[#13ec5b]/5'
                                            : 'border border-slate-200 dark:border-zinc-800'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{skillItem.skill?.name || 'Skill'}</h3>
                                            {getStatusBadge(locked ? 'locked' : status)}
                                        </div>
                                        <p className="text-slate-600 dark:text-zinc-400">{skillItem.skill?.description || 'Learn this skill to progress in your roadmap.'}</p>
                                    </Link>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </section>
            </div>
        </Layout>
    );
};

export default RoadmapDetails;
