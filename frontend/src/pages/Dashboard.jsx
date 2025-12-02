import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import Layout from "../components/Layout";
import config from "../config";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();  
          setDashboardData(data);
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-slate-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="absolute top-4 right-4 z-10 hidden lg:block">
        <ThemeToggle fixedPosition={false} />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-wrap justify-between gap-4 items-center">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                  Welcome back, {dashboardData?.user?.name || user?.name}!
                </h1>
                <p className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal">
                  Here is your progress overview for today.
                </p>
              </div>
            </div>



            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300 h-96 overflow-y-auto">
              <h2 className="text-slate-900 dark:text-white text-lg font-semibold leading-tight tracking-tight sticky top-0 bg-white dark:bg-zinc-900/50 z-10 pb-2">Ongoing Skills</h2>
              <div className="flex flex-col gap-4 mt-2">
                {dashboardData?.ongoingCourses && dashboardData.ongoingCourses.length > 0 ? (
                  dashboardData.ongoingCourses.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                            <span className="material-symbols-outlined text-lg">school</span>
                          </div>
                          <p className="text-slate-900 dark:text-white font-medium">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">{item.progress}%</span>
                          <Link to={`/skill-details/${item.id}`} className="px-3 py-1 bg-[#13ec5b]/10 text-[#13ec5b] text-xs font-bold rounded hover:bg-[#13ec5b]/20 transition-colors">
                            Continue
                          </Link>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-zinc-800">
                        <div className="bg-[#13ec5b] h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-zinc-400">No ongoing skills yet. Start learning!</p>
                )}
              </div>
            </div>


            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300 h-96 overflow-y-auto">
              <h2 className="text-slate-900 dark:text-white text-lg font-semibold leading-tight tracking-tight sticky top-0 bg-white dark:bg-zinc-900/50 z-10 pb-2">Incomplete Roadmaps</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-2">
                {dashboardData?.incompleteRoadmaps && dashboardData.incompleteRoadmaps.length > 0 ? (
                  dashboardData.incompleteRoadmaps.map((roadmap, index) => (
                    <Link to={`/roadmap-details/${roadmap.id}`} key={index} className="flex flex-col gap-3 group p-4 border border-slate-100 dark:border-zinc-800 rounded-lg hover:border-[#13ec5b]/50 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal group-hover:text-[#13ec5b] transition-colors">{roadmap.name}</p>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1 line-clamp-2">{roadmap.description}</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 dark:bg-zinc-800 mt-1.5">
                        <div className="bg-[#13ec5b] h-1.5 rounded-full" style={{ width: `${roadmap.progress || 0}%` }}></div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-zinc-400">No incomplete roadmaps.</p>
                )}
              </div>
            </div>


            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300 h-96 overflow-y-auto">
              <h2 className="text-slate-900 dark:text-white text-lg font-semibold leading-tight tracking-tight sticky top-0 bg-white dark:bg-zinc-900/50 z-10 pb-2">Recommended for You</h2>
              <div className="flex gap-5 mt-2 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
                {dashboardData?.recommendedCourses && dashboardData.recommendedCourses.length > 0 ? (
                  dashboardData.recommendedCourses.map((course, index) => (
                    <Link to={`/skill-details/${course.id}`} key={index} className="flex flex-col gap-3 group cursor-pointer min-w-[200px] snap-start">
                      <div className="w-full aspect-square rounded-lg bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:scale-105 transition-transform duration-300">
                        <span className="material-symbols-outlined text-5xl">school</span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white text-base font-medium leading-normal group-hover:text-[#13ec5b] transition-colors">{course.name}</p>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">{course.category}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-zinc-400">No recommendations available.</p>
                )}
              </div>
            </div>
          </div>


          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">

            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center transition-colors duration-300">
              <div className="flex items-center justify-center rounded-full size-20 bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                <span className="material-symbols-outlined text-4xl">person</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-xl font-semibold mt-4">{dashboardData?.user?.name || user?.name}</h2>
              <div className="w-full mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-zinc-400">Total XP</span>
                  <span className="text-2xl font-bold text-[#13ec5b]">{dashboardData?.user?.xp || 0}</span>
                </div>
              </div>
            </div>


            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4">Earned Badges</h3>
              <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-2">
                {dashboardData?.badges && dashboardData.badges.length > 0 ? (
                  dashboardData.badges.map((badge, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="grid place-content-center size-16 rounded-full bg-[#13ec5b]/10 text-[#13ec5b] text-3xl">
                        <span className="material-symbols-outlined">{badge.icon}</span>
                      </div>
                      <p className="text-xs font-medium text-center text-slate-500 dark:text-zinc-400">{badge.title}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-4 text-center text-slate-500 dark:text-zinc-400">No badges earned yet.</p>
                )}
              </div>
            </div>


            <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white text-lg font-semibold">Leaderboard</h3>

              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-[#13ec5b] w-6 text-center">1</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Ava Chen</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">1,250 XP</p>
                  </div>
                  <span className="material-symbols-outlined text-yellow-500">military_tech</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-slate-400 dark:text-zinc-500 w-6 text-center">2</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Liam Rodriguez</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">1,180 XP</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">military_tech</span>
                </div>
                <div className="flex items-center gap-3 bg-[#13ec5b]/5 dark:bg-[#13ec5b]/10 p-2 rounded-lg -mx-2">
                  <span className="text-xl font-bold text-slate-400 dark:text-zinc-500 w-6 text-center">3</span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{dashboardData?.user?.name || user?.name} (You)</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">{dashboardData?.user?.xp || 0} XP</p>
                  </div>
                  <span className="material-symbols-outlined text-orange-400">military_tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
