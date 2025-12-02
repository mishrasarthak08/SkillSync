import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon, label }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(to)
                ? 'bg-[#13ec5b]/10 text-[#13ec5b] dark:bg-[#13ec5b]/20'
                : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400'
                }`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <span className={`material-symbols-outlined ${isActive(to) ? 'text-[#13ec5b]' : ''}`}>{icon}</span>
            <p className={`text-sm font-medium leading-normal ${isActive(to) ? 'font-semibold' : ''}`}>{label}</p>
        </Link>
    );

    return (
        <div className="bg-[#f6f8f6] dark:bg-black font-display text-slate-900 dark:text-white transition-colors duration-300 min-h-screen flex flex-col lg:flex-row">

            
            <div className="lg:hidden bg-white dark:bg-black border-b border-slate-200 dark:border-zinc-800 p-4 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-[#13ec5b] text-2xl">hub</span>
                        <span>SkillSync</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle fixedPosition={false} />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>

                
                {isMobileMenuOpen && (
                    <div className="mt-4 flex flex-col gap-2 pb-2 animate-in slide-in-from-top-2 duration-200">
                        <NavLink to="/dashboard" icon="dashboard" label="Dashboard" />
                        <NavLink to="/explore" icon="search" label="Explore Skills" />
                        <NavLink to="/roadmaps" icon="timeline" label="Roadmaps" />
                        <hr className="border-slate-200 dark:border-zinc-800 my-2" />
                        <NavLink to="/settings" icon="settings" label="Settings" />
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors w-full text-left text-slate-500 dark:text-zinc-400"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <p className="text-sm font-medium leading-normal">Logout</p>
                        </button>
                    </div>
                )}
            </div>

            
            <aside className="hidden lg:flex sticky top-0 h-screen w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-black transition-colors duration-300">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-[#13ec5b] text-3xl">hub</span>
                        <span>SkillSync</span>
                    </div>
                    <nav className="flex flex-col gap-2 mt-8 flex-grow">
                        <NavLink to="/dashboard" icon="dashboard" label="Dashboard" />
                        <NavLink to="/explore" icon="search" label="Explore Skills" />
                        <NavLink to="/roadmaps" icon="timeline" label="Roadmaps" />
                    </nav>
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                    <NavLink to="/settings" icon="settings" label="Settings" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors w-full text-left text-slate-500 dark:text-zinc-400"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium leading-normal">Logout</p>
                    </button>
                </div>
            </aside>

            
            <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
