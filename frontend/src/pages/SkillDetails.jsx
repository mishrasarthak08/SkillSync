import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Layout from '../components/Layout';
import config from '../config';

const SkillDetails = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSkill = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_URL}/api/skills/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSkill(data);


                const startResponse = await fetch(`${config.API_URL}/api/skills/${id}/start`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (startResponse.ok) {

                    const refreshResponse = await fetch(`${config.API_URL}/api/skills/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (refreshResponse.ok) {
                        const refreshedData = await refreshResponse.json();
                        setSkill(refreshedData);
                    }
                }
            }
        } catch (error) {
            // Error handling silently ignored as per cleanup
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchSkill();
        }
    }, [id, fetchSkill]);

    const handleCompleteLesson = async (skillId, lessonId) => {

        try {
            const token = localStorage.getItem('token');


            const url = `${config.API_URL}/api/skills/${skillId}/lessons/${lessonId}/complete`;


            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });



            if (response.ok) {
                const data = await response.json();


                if (data.skillCompleted) {
                    alert(`🎉 Skill Completed! You earned ${data.xpAwarded} XP!`);
                    if (data.badgesEarned.length > 0) {
                        alert(`🏆 New Badge Unlocked: ${data.badgesEarned.map(b => b.title).join(', ')}!`);
                    }
                } else if (data.xpAwarded > 0) {
                    alert(`✅ Lesson Completed! Keep going!`);
                } else {
                    alert(`✅ Lesson Completed!`);
                }

                fetchSkill();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));

                alert(`Failed to complete lesson: ${errorData.message || response.statusText}`);
            }
        } catch (error) {

            alert(`Failed to complete lesson. Error: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="mx-auto max-w-4xl">
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">Loading skill...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!skill) {
        return (
            <Layout>
                <div className="mx-auto max-w-4xl">
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">Skill not found.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mx-auto max-w-4xl">


                <div className="flex justify-end mb-6 hidden lg:flex">
                    <div className="flex items-center gap-4">
                        <ThemeToggle fixedPosition={false} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pb-6">
                    <Link className="text-slate-500 dark:text-zinc-400 hover:text-[#13ec5b] dark:hover:text-[#13ec5b] text-sm font-medium" to="/explore">My Skills</Link>
                    <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">/</span>
                    <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{skill.category}</span>
                    <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">/</span>
                    <span className="text-slate-900 dark:text-white text-sm font-medium">{skill.name}</span>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">{skill.name}</p>
                        {skill.userStatus !== 'not_enrolled' && (
                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to leave this skill? Your progress will be lost.')) {
                                        try {
                                            const token = localStorage.getItem('token');
                                            const response = await fetch(`${config.API_URL}/api/skills/${id}/enrollment`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                }
                                            });
                                            if (response.ok) {
                                                navigate('/dashboard');
                                            } else {
                                                alert('Failed to leave skill');
                                            }
                                        } catch (error) {
                                            console.error('Error leaving skill:', error);
                                        }
                                    }
                                }}
                                className="px-4 py-2 bg-red-500/10 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-colors self-start md:self-auto"
                            >
                                Leave Skill
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#13ec5b]/20 px-4">
                            <p className="text-[#13ec5b] text-sm font-medium">{skill.category}</p>
                        </div>
                        <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#13ec5b]/20 px-4">
                            <p className="text-[#13ec5b] text-sm font-medium">{skill.difficulty}</p>
                        </div>
                    </div>
                </div>

                <div className="my-8">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">Progress</p>
                        <p className="text-sm font-bold text-[#13ec5b]">{skill.progressPercentage || 0}% Complete</p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-3">
                        <div className="bg-[#13ec5b] h-3 rounded-full" style={{ width: `${skill.progressPercentage || 0}%` }}></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">About this Skill</h2>
                    <p className="text-slate-600 dark:text-zinc-300 text-base font-normal leading-relaxed">{skill.description}</p>
                </div>

                <div className="mt-10" id="learning-modules">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Learning Modules</h2>
                    <div className="flex flex-col gap-3">
                        {skill.modules && skill.modules.length > 0 ? (
                            skill.modules.map((module) => (
                                <div key={module.id}>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2 mt-4 px-2">{module.title}</h3>
                                    {module.lessons && module.lessons.map((lesson) => (
                                        <div key={lesson.id} className={`flex items-center justify-between p-4 mb-2 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 ${lesson.locked ? 'opacity-60' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`flex items-center justify-center size-10 rounded-full ${lesson.completed
                                                    ? 'bg-[#13ec5b]/20 text-[#13ec5b]'
                                                    : lesson.locked
                                                        ? 'bg-slate-200 dark:bg-zinc-700 text-slate-500 dark:text-zinc-400'
                                                        : 'bg-[#13ec5b] text-black'
                                                    }`}>
                                                    <span className="material-symbols-outlined">
                                                        {lesson.completed ? 'check_circle' : lesson.locked ? 'lock' : 'play_circle'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{lesson.title}</p>
                                                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                                                        {lesson.completed ? 'Completed' : lesson.locked ? 'Locked' : 'In Progress'}
                                                    </p>
                                                </div>
                                            </div>
                                            {!lesson.completed && !lesson.locked && (
                                                <button
                                                    onClick={() => handleCompleteLesson(skill.id, lesson.id)}
                                                    className="px-4 py-2 bg-[#13ec5b] text-black text-sm font-bold rounded-lg hover:bg-[#13ec5b]/90 transition-colors shadow-sm"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            {lesson.completed && (
                                                <span className="material-symbols-outlined text-[#13ec5b]">check</span>
                                            )}
                                            {lesson.locked && (
                                                <span className="material-symbols-outlined text-slate-400">lock</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 dark:text-zinc-400">No modules available for this skill yet.</p>
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Related Roadmaps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skill.roadmaps && skill.roadmaps.length > 0 ? (
                            skill.roadmaps.map((roadmapSkill) => (
                                <Link
                                    key={roadmapSkill.roadmap.id}
                                    to={`/roadmap-details/${roadmapSkill.roadmap.id}`}
                                    className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-slate-200 dark:border-zinc-800 hover:border-[#13ec5b]/50 block"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="material-symbols-outlined text-[#13ec5b]">map</span>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{roadmapSkill.roadmap.title}</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-zinc-300 text-sm">{roadmapSkill.roadmap.description}</p>
                                </Link>
                            ))
                        ) : (
                            <p className="text-slate-500 dark:text-zinc-400">No related roadmaps found.</p>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default SkillDetails;
