import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ThemeToggle from "../components/ThemeToggle";
import config from "../config";

export default function Settings() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("enrolled");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');


                const dashboardResponse = await fetch(`${config.API_URL}/api/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (dashboardResponse.ok) {
                    const data = await dashboardResponse.json();
                    setDashboardData(data);
                }


                const userResponse = await fetch(`${config.API_URL}/api/users/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();

                    if (userData.progress) {
                        const completed = userData.progress.filter(p => p.completed);
                        setCompletedLessons(completed);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-slate-600 dark:text-zinc-400">Loading settings...</p>
                </div>
            </Layout>
        );
    }

    const userData = dashboardData?.user || user;
    const badges = dashboardData?.badges || [];
    const ongoingCourses = dashboardData?.ongoingCourses || [];

    return (
        <Layout>
            <div className="absolute top-4 right-4 z-10 hidden lg:block">
                <ThemeToggle fixedPosition={false} />
            </div>
            <div className="max-w-4xl mx-auto">
                <div className="flex-1">
                    <div className="flex p-6 @container bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                        <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between md:items-center">
                            <div className="flex gap-6 items-center">
                                <div className="flex items-center justify-center rounded-full size-32 bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                                    <span className="material-symbols-outlined text-6xl">person</span>
                                </div>
                                <div className="flex flex-col justify-center gap-1">
                                    <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">{userData?.name}</p>
                                    <p className="text-base font-normal leading-normal text-slate-500 dark:text-zinc-400">Aspiring Full-Stack Developer | Lifelong Learner</p>
                                    <p className="text-base font-normal leading-normal text-slate-500 dark:text-zinc-400">Level {Math.floor((userData?.xp || 0) / 1000) + 1} - {userData?.skillLevel || 'Beginner'}</p>
                                </div>
                            </div>
                            <div className="flex w-full max-w-[480px] gap-3 md:w-auto">
                                <Link to="/edit-profile" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#13ec5b] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 md:flex-auto hover:bg-[#13ec5b]/90 transition-colors">
                                    <span className="truncate">Edit Profile</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm transition-colors duration-300">
                            <p className="text-base font-medium leading-normal text-slate-500 dark:text-zinc-400">Total XP</p>
                            <p className="tracking-light text-2xl font-bold leading-tight text-slate-900 dark:text-white">{userData?.xp || 0}</p>
                        </div>
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm transition-colors duration-300">
                            <p className="text-base font-medium leading-normal text-slate-500 dark:text-zinc-400">Skills Mastered</p>
                            <p className="tracking-light text-2xl font-bold leading-tight text-slate-900 dark:text-white">{userData?.skillsMastered || 0}</p>
                        </div>
                        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm transition-colors duration-300">
                            <p className="text-base font-medium leading-normal text-slate-500 dark:text-zinc-400">Lessons Completed</p>
                            <p className="tracking-light text-2xl font-bold leading-tight text-slate-900 dark:text-white">{completedLessons.length}</p>
                        </div>
                    </div>

                    <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 text-slate-900 dark:text-white">Earned Badges</h2>
                    <div className="flex gap-4 p-4 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300 overflow-x-auto">
                        {badges.length > 0 ? (
                            badges.map((badge, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-zinc-800/50 min-w-[120px]">
                                    <div className="grid place-content-center size-20 rounded-full bg-[#13ec5b]/10 text-[#13ec5b] text-4xl">
                                        <span className="material-symbols-outlined">{badge.icon}</span>
                                    </div>
                                    <p className="text-sm font-medium text-center text-slate-900 dark:text-zinc-300">{badge.title}</p>
                                </div>
                            ))
                        ) : (
                            <p className="w-full text-center text-slate-500 dark:text-zinc-400 py-4">No badges earned yet.</p>
                        )}
                    </div>

                    <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 text-slate-900 dark:text-white">Interests</h2>
                    <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                        {userData?.interests && userData.interests.length > 0 ? (
                            userData.interests.map((interest, index) => (
                                <span key={index} className="px-3 py-1 text-sm font-medium rounded-full bg-[#13ec5b]/20 text-[#13ec5b]">{interest}</span>
                            ))
                        ) : (
                            <p className="text-slate-500 dark:text-zinc-400">No interests selected.</p>
                        )}
                    </div>

                    <div className="mt-8">
                        <div className="border-b border-slate-200 dark:border-zinc-700">
                            <nav aria-label="Tabs" className="-mb-px flex gap-6 px-4">
                                <button
                                    onClick={() => setActiveTab("enrolled")}
                                    className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "enrolled" ? "border-[#13ec5b] text-[#13ec5b]" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"}`}
                                >
                                    Enrolled Skills
                                </button>
                                <button
                                    onClick={() => setActiveTab("completed")}
                                    className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "completed" ? "border-[#13ec5b] text-[#13ec5b]" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"}`}
                                >
                                    Completed Lessons
                                </button>
                                <button
                                    onClick={() => setActiveTab("activity")}
                                    className={`shrink-0 border-b-2 px-1 pb-3 text-sm font-medium ${activeTab === "activity" ? "border-[#13ec5b] text-[#13ec5b]" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"}`}
                                >
                                    Activity
                                </button>
                            </nav>
                        </div>
                        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
                            {activeTab === "enrolled" && (
                                ongoingCourses.length > 0 ? (
                                    ongoingCourses.map((course, index) => (
                                        <div key={index} className="p-4 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-slate-900 dark:text-white">{course.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-zinc-400">{course.progress}%</p>
                                            </div>
                                            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-700">
                                                <div className="h-2 rounded-full bg-[#13ec5b]" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 dark:text-zinc-400 px-4">No enrolled skills yet.</p>
                                )
                            )}
                            {activeTab === "completed" && (
                                completedLessons.length > 0 ? (
                                    completedLessons.map((lesson, index) => (
                                        <div key={index} className="p-4 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#13ec5b]">check_circle</span>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{lesson.lesson?.title || 'Lesson'}</p>
                                                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                                                            Completed {lesson.completedAt ? new Date(lesson.completedAt).toLocaleDateString() : 'recently'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 dark:text-zinc-400 px-4">No completed lessons yet.</p>
                                )
                            )}
                            {activeTab === "activity" && (
                                completedLessons.length > 0 ? (
                                    completedLessons
                                        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                                        .slice(0, 10)
                                        .map((lesson, index) => (
                                            <div key={index} className="p-4 bg-white dark:bg-zinc-900/50 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 transition-colors duration-300">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-[#13ec5b]">history</span>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">Completed: {lesson.lesson?.title || 'Lesson'}</p>
                                                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                                                            {lesson.completedAt ? new Date(lesson.completedAt).toLocaleString() : 'Recently'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-slate-500 dark:text-zinc-400 px-4">No recent activity.</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
