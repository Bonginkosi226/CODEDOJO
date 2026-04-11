import React, { useState, useEffect } from "react";
import { Trophy, Medal, Star, Flame, Crown } from "lucide-react";
import leaderboardService from "../../services/leaderboardService";
import { useAuth } from "../../context/AuthContext";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardService.getLeaderboard();
      if (response.success) {
        setLeaderboard(response.data);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      // Graceful fail: don't show a massive error if it's just intermittent
      if (leaderboard.length === 0) {
        setError("Unable to load the leaderboard at this time.");
      }
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // SWR / React Query style polling - every 5 seconds for pseudo-real-time
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && leaderboard.length === 0) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-slate-400">
        <Trophy size={64} className="mb-4 opacity-50" />
        <p className="text-lg font-bold">{error}</p>
        <button 
          onClick={fetchLeaderboard}
          className="mt-4 px-6 py-2 bg-amber-400 text-white font-bold rounded-xl shadow-[0_4px_0_theme(colors.amber.600)] hover:-translate-y-1 hover:shadow-[0_6px_0_theme(colors.amber.600)] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const theRest = leaderboard.slice(3);

  const getRankColor = (index) => {
    switch(index) {
      case 0: return "from-yellow-300 to-amber-500 border-yellow-300 shadow-amber-600/30 text-yellow-900"; // Gold
      case 1: return "from-slate-300 to-slate-400 border-slate-300 shadow-slate-500/30 text-slate-800"; // Silver
      case 2: return "from-orange-300 to-orange-500 border-orange-300 shadow-orange-600/30 text-orange-950"; // Bronze
      default: return "from-white to-slate-50 border-slate-200 text-slate-800 shadow-[0_4px_0_theme(colors.slate.200)]";
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex flex-col items-center mb-12 mt-8 text-center">
        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-[0_6px_0_theme(colors.orange.600)]">
          <Trophy size={40} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight mb-2">Hall of Fame</h1>
        <p className="text-lg font-bold text-slate-400">Global Leaderboard — Updating Live</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 mb-12 h-64 px-4">
        {/* Silver (Rank 2) */}
        {topThree[1] && (
          <div className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1 translate-y-[20px]">
            <div className={`relative w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${getRankColor(1)} border-4 mb-4 flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-3xl font-black opacity-80">2</span>
              <div className="absolute -top-3 right-[-10px] bg-white border-2 border-slate-200 rounded-full w-8 h-8 flex items-center justify-center">
                <Medal size={16} className="text-slate-400" />
              </div>
            </div>
            <div className="w-full bg-white border-4 border-slate-200 rounded-[2rem] p-4 text-center shadow-[0_6px_0_theme(colors.slate.200)] relative z-10 hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-black text-lg text-slate-800 truncate">{topThree[1].username}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500 font-bold bg-slate-50 py-1.5 rounded-xl border-2 border-slate-100">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                {topThree[1].xp} XP
              </div>
              <div className="text-xs font-black text-slate-400 mt-2">Lv {topThree[1].level}</div>
            </div>
          </div>
        )}

        {/* Gold (Rank 1) */}
        {topThree[0] && (
          <div className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2 z-20 hover:-translate-y-4 transition-transform duration-300">
            <div className="relative">
              <Crown size={40} strokeWidth={2.5} className="text-amber-400 absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-md animate-bounce" />
              <div className={`relative w-24 h-24 rounded-[1.75rem] bg-gradient-to-br ${getRankColor(0)} border-4 mb-4 flex items-center justify-center flex-shrink-0 shadow-[0_8px_20px_theme(colors.amber.500/0.4)]`}>
                <span className="text-4xl font-black opacity-90">1</span>
              </div>
            </div>
            <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-300 rounded-[2rem] p-5 text-center shadow-[0_8px_0_theme(colors.amber.400)] relative">
              <h3 className="font-black text-xl text-slate-800 truncate">{topThree[0].username}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-amber-600 font-black bg-amber-100 py-2 rounded-xl border-2 border-amber-200">
                <Flame size={16} className="text-orange-500 fill-orange-500" />
                {topThree[0].xp} XP
              </div>
              <div className="text-sm font-black text-amber-500 mt-2 uppercase">Level {topThree[0].level}</div>
            </div>
          </div>
        )}

        {/* Bronze (Rank 3) */}
        {topThree[2] && (
          <div className="w-full sm:w-1/3 flex flex-col items-center order-3 translate-y-[40px]">
            <div className={`relative w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${getRankColor(2)} border-4 mb-4 flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-3xl font-black opacity-80">3</span>
            </div>
            <div className="w-full bg-white border-4 border-slate-200 rounded-[2rem] p-4 text-center shadow-[0_6px_0_theme(colors.slate.200)] relative z-10 hover:-translate-y-2 transition-transform duration-300">
              <h3 className="font-black text-lg text-slate-800 truncate">{topThree[2].username}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500 font-bold bg-slate-50 py-1.5 rounded-xl border-2 border-slate-100">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                {topThree[2].xp} XP
              </div>
              <div className="text-xs font-black text-slate-400 mt-2">Lv {topThree[2].level}</div>
            </div>
          </div>
        )}
      </div>

      {/* The Rest of the Leaderboard */}
      {theRest.length > 0 && (
        <div className="bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_8px_0_theme(colors.slate.200)] overflow-hidden mt-12 sm:mt-0">
          <div className="p-6 border-b-4 border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-800">Runner Ups</h3>
            <span className="text-sm font-bold text-slate-400">{leaderboard.length} Players</span>
          </div>
          <div className="divide-y-2 divide-slate-100">
            {theRest.map((player, index) => {
              const rank = index + 4;
              const isMe = user?.username === player.username;
              
              return (
                <div key={player._id} className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${isMe ? 'bg-sky-50 hover:bg-sky-50' : ''}`}>
                  <div className="w-12 h-12 shrink-0 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black border-2 border-slate-200">
                    #{rank}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-black truncate text-lg ${isMe ? 'text-sky-600' : 'text-slate-800'}`}>
                      {player.username} {isMe && <span className="text-xs font-bold text-sky-400 bg-white border-2 border-sky-200 px-2 py-0.5 rounded-full ml-2 relative -top-0.5">YOU</span>}
                    </h4>
                    <p className="text-sm font-bold text-slate-400">Level {player.level}</p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-1.5 bg-white border-2 border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-black shadow-sm">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {player.xp}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
