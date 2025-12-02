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
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
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
        const fetchRoadmaps = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const queryParams = new URLSearchParams({
                    page: currentPage,
                    limit: 9,
                    search: debouncedSearch,
                    sort: sort
                });

                const response = await fetch(`${config.API_URL}/api/roadmaps?${queryParams}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Handle both new (object with data property) and old (direct array) API response formats
                    const roadmapsData = Array.isArray(data) ? data : (data.data || []);
                    const pages = data.pagination ? data.pagination.pages : 1;

                    setRoadmaps(roadmapsData);
                    setTotalPages(pages);
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
    }, [currentPage, debouncedSearch, sort]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, sort]);

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

                <div className="w-full flex flex-col sm:flex-row gap-4">
                    <label className="flex flex-col h-14 w-full sm:w-auto flex-grow">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 focus-within:border-[#13ec5b] focus-within:ring-2 focus-within:ring-[#13ec5b]/50 transition-all">
                            <div className="text-slate-500 dark:text-zinc-400 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-400 dark:placeholder:text-zinc-500 px-4 pl-2 text-base font-normal leading-normal"
                                placeholder="Search roadmaps..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </label>

                    <div className="h-14 w-full sm:w-48 shrink-0">
                        <div className="relative h-full">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full h-full appearance-none rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-4 pr-10 focus:outline-none focus:border-[#13ec5b] focus:ring-2 focus:ring-[#13ec5b]/50 transition-all cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-zinc-400">
                                <span className="material-symbols-outlined">sort</span>
                            </div>
                        </div>
                    </div>
                </div>


                <section className="flex flex-col gap-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-zinc-400">Loading roadmaps...</p>
                        </div>
                    ) : roadmaps.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 dark:text-zinc-400">No roadmaps available.</p>
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
        </Layout>
    );
};

export default Roadmaps;
