import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import Layout from '../components/Layout';
import config from '../config';

const ExploreSkills = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchSkills = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const queryParams = new URLSearchParams({
                    page: currentPage,
                    limit: 9,
                    search: debouncedSearch,
                    category: filter,
                    sort: 'newest'
                });

                const response = await fetch(`${config.API_URL}/api/skills?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSkills(data.data);
                    setTotalPages(data.pagination.pages);
                } else {
                    console.error('Failed to fetch skills');
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [currentPage, filter, debouncedSearch]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, debouncedSearch]);

    const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Design', 'Data Science', 'Cloud Computing'];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto flex flex-col gap-8">


                <div className="flex justify-between items-center">
                    <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Explore Skills</h1>
                    <div className="flex items-center gap-4 hidden lg:flex">
                        <ThemeToggle fixedPosition={false} />
                    </div>
                </div>


                <div className="w-full">
                    <label className="flex flex-col h-14 w-full">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 focus-within:border-[#13ec5b] focus-within:ring-2 focus-within:ring-[#13ec5b]/50 transition-all">
                            <div className="text-slate-500 dark:text-zinc-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-4 pl-2 text-base font-normal leading-normal"
                                placeholder="Search for skills..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </label>
                </div>


                <div className="flex gap-3 flex-wrap">
                    {categories.map(category => (
                        <div
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`flex h-10 cursor-pointer shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 transition-colors ${filter === category
                                ? 'bg-[#13ec5b]'
                                : 'bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:bg-[#13ec5b]/20'
                                }`}
                        >
                            <p className={`text-sm font-medium leading-normal ${filter === category
                                ? 'text-black'
                                : 'text-slate-600 dark:text-zinc-400'
                                }`}>{category}</p>
                        </div>
                    ))}
                </div>


                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">Loading skills...</p>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-zinc-400">No skills found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex flex-col gap-4 p-4 bg-white dark:bg-zinc-900/50 rounded-xl border border-slate-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <div className="w-full aspect-video rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                                    <span className="material-symbols-outlined text-5xl">school</span>
                                </div>
                                <div className="flex flex-col gap-3 flex-grow">
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">{skill.name}</p>
                                        <span className="text-xs font-medium bg-[#13ec5b]/20 text-green-700 dark:text-[#13ec5b] px-2 py-1 rounded-full">{skill.difficulty}</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-normal leading-normal flex-grow">{skill.description}</p>
                                    {skill.userStatus === 'completed' ? (
                                        <div className="w-full mt-2 bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-400 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[#13ec5b]">check_circle</span>
                                            Completed
                                        </div>
                                    ) : skill.userStatus === 'in_progress' ? (
                                        <Link to={`/skill-details/${skill.id}`} className="w-full mt-2 bg-[#13ec5b] text-black font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity block text-center">
                                            Continue
                                        </Link>
                                    ) : (
                                        <Link to={`/skill-details/${skill.id}`} className="w-full mt-2 bg-[#13ec5b] text-black font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity block text-center">
                                            Enroll
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 pb-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageChange(number)}
                                className={`flex items-center justify-center size-10 rounded-lg text-sm font-bold transition-colors ${currentPage === number
                                    ? 'bg-[#13ec5b] text-black'
                                    : 'border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center size-10 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                )}
            </div>
        </Layout >
    );
};

export default ExploreSkills;
