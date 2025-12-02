import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-black group/design-root overflow-x-hidden font-display transition-colors duration-300">
            <div className="layout-container flex h-full grow flex-col">
                <ThemeToggle />
                <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center items-center py-10 md:py-16">
                    <div className="layout-content-container flex flex-col max-w-5xl flex-1 items-center justify-center">
                        <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl md:text-5xl lg:text-6xl font-bold leading-tight px-4 text-center pb-6 pt-6">Welcome to SkillSync!</h1>
                        <p className="text-gray-600 dark:text-gray-300 text-xl font-normal leading-relaxed pb-12 pt-2 px-4 text-center max-w-3xl">
                            Your journey to mastery starts here. Learn new skills, track your progress, and get rewarded every step of the way.
                        </p>
                        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 mb-12">
                            <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-white/5 p-8 flex-col items-center text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300">
                                <div className="text-[#13ec5b] mb-2">
                                    <span className="material-symbols-outlined !text-5xl">joystick</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Gamified Learning</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Earn XP and badges as you learn.</p>
                                </div>
                            </div>
                            <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-white/5 p-8 flex-col items-center text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300">
                                <div className="text-[#13ec5b] mb-2">
                                    <span className="material-symbols-outlined !text-5xl">trending_up</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Track Your Progress</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Visualize your skill growth.</p>
                                </div>
                            </div>
                            <div className="flex flex-1 gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-white/5 p-8 flex-col items-center text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors duration-300">
                                <div className="text-[#13ec5b] mb-2">
                                    <span className="material-symbols-outlined !text-5xl">route</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">Build Your Roadmap</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Follow structured learning paths.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex px-4 py-6 justify-center w-full max-w-xs">
                            <button
                                onClick={() => navigate('/interests')}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 px-8 flex-1 bg-[#13ec5b] text-[#102216] text-xl font-bold leading-normal tracking-[0.015em] hover:bg-[#0fd450] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#13ec5b]/20"
                            >
                                <span className="truncate">Get Started</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
