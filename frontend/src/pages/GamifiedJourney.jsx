import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function GamifiedJourney() {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f8f6] dark:bg-black font-display transition-colors duration-300">
            <ThemeToggle />
            <div className="flex h-full grow flex-col mt-16">
                <main className="flex flex-1 justify-center py-10 sm:py-16 px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col max-w-4xl flex-1 items-center">
                        
                        <div className="flex flex-col items-center text-center max-w-2xl mx-auto px-4">
                            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">Welcome! Your Learning Adventure Begins.</h1>
                            <p className="mt-4 text-base leading-normal text-zinc-600 dark:text-zinc-400">Learning on SkillSync is a rewarding game. Complete tasks, gain XP, and unlock achievements to showcase your progress.</p>
                        </div>

                        
                        <div className="mt-12 w-full max-w-4xl">
                            <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="flex items-stretch gap-4 sm:gap-6 p-4 w-full justify-center flex-col sm:flex-row flex-wrap md:flex-nowrap">
                                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl min-w-[260px] sm:min-w-[280px] bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#13ec5b]/20 text-[#13ec5b]">
                                            <span className="material-symbols-outlined text-3xl">star</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-base font-bold text-zinc-900 dark:text-white">Earn XP</p>
                                            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400">Earn XP for every lesson you complete, quiz you pass, and project you submit.</p>
                                        </div>
                                    </div>
                                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl min-w-[260px] sm:min-w-[280px] bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#13ec5b]/20 text-[#13ec5b]">
                                            <span className="material-symbols-outlined text-3xl">trending_up</span>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-zinc-900 dark:text-white">Level Up</p>
                                            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400">As you gain XP, you'll level up, showcasing your dedication and progress.</p>
                                        </div>
                                    </div>
                                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl min-w-[260px] sm:min-w-[280px] bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#13ec5b]/20 text-[#13ec5b]">
                                            <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-zinc-900 dark:text-white">Unlock Badges</p>
                                            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400">Unlock unique badges for mastering skills and hitting key milestones.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-12 w-full max-w-2xl px-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl bg-white dark:bg-zinc-900/70 p-6 shadow-lg border border-zinc-200 dark:border-zinc-800">
                                <div className="flex flex-col gap-1 flex-1 text-center sm:text-left">
                                    <p className="text-xl sm:text-2xl font-bold leading-tight text-[#13ec5b]">+100 XP</p>
                                    <p className="text-sm font-normal leading-normal text-zinc-600 dark:text-zinc-300">You've earned your first reward for completing the onboarding!</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-400 dark:text-zinc-600 text-3xl">&</span>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#13ec5b]/10">
                                            <span className="material-symbols-outlined text-4xl text-[#13ec5b]">flag</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">First Step Badge</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="mt-12 flex px-4 py-3 justify-center w-full max-w-sm">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#13ec5b] text-[#102216] text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity shadow-lg shadow-[#13ec5b]/20"
                            >
                                <span className="truncate">Go to Dashboard</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
