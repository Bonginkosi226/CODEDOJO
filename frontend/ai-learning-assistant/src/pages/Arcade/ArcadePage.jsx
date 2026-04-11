import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Sparkles, MessageSquare, Code2, ArrowLeft, 
  Gamepad2, Lock, Swords, Target, Puzzle, Trophy, 
  Star, Volume2, VolumeX, ChevronRight, ChevronLeft,
  CheckCircle2, Play, Info, HelpCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTelemetry } from "../../context/TelemetryContext.jsx";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import CodeEditor from "../../components/common/CodeEditor";
import arcadeService from "../../services/arcadeService";
import leaderboardService from "../../services/leaderboardService";
import { PYTHON_CURRICULUM, JAVA_CURRICULUM } from "../../data/curriculum";

// ─── Progress Bar Component ───
const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
      <div 
        className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// ─── Arcade Roadmap Component (Simplified for Refactored View) ───
const ArcadeRoadmap = ({ language, progress, onStart }) => {
  const curriculum = language === "python" ? PYTHON_CURRICULUM : JAVA_CURRICULUM;
  
  return (
    <div className="flex flex-col items-center py-8 max-w-4xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          The <span className="text-sky-500">{language.toUpperCase()}</span> Path
        </h2>
        <p className="text-slate-500 font-bold max-w-lg mx-auto">
          Master the fundamentals step-by-step with Sensei. Complete challenges to unlock your potential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {curriculum.map((lesson, index) => {
          const isLocked = index > progress;
          const isCompleted = index < progress;
          const isActive = index === progress;

          return (
            <div 
              key={lesson.id}
              className={`relative overflow-hidden group p-6 rounded-[2rem] border-4 transition-all duration-300 ${
                isActive ? 'bg-white border-amber-300 shadow-xl scale-105' : 
                isCompleted ? 'bg-slate-50 border-emerald-200 opacity-80' : 
                'bg-slate-50 border-slate-100 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-4 ${
                  isActive ? 'bg-amber-100 border-amber-400 text-amber-600' :
                  isCompleted ? 'bg-emerald-100 border-emerald-400 text-emerald-600' :
                  'bg-slate-200 border-slate-300 text-slate-400'
                }`}>
                  {isCompleted ? <Trophy size={20} /> : index + 1}
                </div>
                {isActive && (
                  <span className="px-3 py-1 bg-amber-400 text-white text-[10px] font-black uppercase rounded-full animate-bounce">
                    Next Up
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-black mb-1 ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                {lesson.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 mb-6">{lesson.concept}</p>

              {isActive ? (
                <button 
                  onClick={() => onStart(index)}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-black uppercase rounded-2xl shadow-[0_4px_0_theme(colors.amber.600)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                  <Play size={18} fill="currentColor" />
                  Enter Dojo
                </button>
              ) : isLocked ? (
                <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-sm py-3">
                  <Lock size={16} /> Locked
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-sm py-3">
                  <CheckCircle2 size={16} /> Mastery Achieved
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Dojo Path Game (Main Refactored UI) ───
const DojoPathGame = ({ language, onBack }) => {
  const { user } = useAuth();
  const { track } = useTelemetry();
  const curriculum = language === "python" ? PYTHON_CURRICULUM : JAVA_CURRICULUM;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [isAskingSensei, setIsAskingSensei] = useState(false);
  const [senseiHelp, setSenseiHelp] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const lesson = curriculum[currentIdx];

  // Fetch initial progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await arcadeService.getProgress();
        if (response.success) {
          setCurrentIdx(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    if (!showRoadmap) {
      setCode(lesson.initialCode);
      setIsCompleted(false);
      setOutput("");
      setSenseiHelp("");
      setIsHelpOpen(false);
      
      track("lesson_start", lesson.id, { language });
      
      if (isVoiceEnabled) {
        speak(lesson.narrative);
      }
    }
  }, [currentIdx, showRoadmap]);

  const speak = (text) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`🎯]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleRunCode = async (currentCode) => {
    // If user clicks "Ask AI" in the editor, we trigger Sensei's help
    askSensei();
  };

  const handleCompileResult = async (code, output) => {
    const rawOutput = output || "";
    setOutput(rawOutput);
    const success = lesson.validation ? lesson.validation(rawOutput) : false;
    if (success && !isCompleted) {
      setIsCompleted(true);
      track("lesson_complete", lesson.id, { language, xp: lesson.xp });
      
      try {
        await arcadeService.updateProgress(currentIdx + 1);
        // Award XP
        if (lesson.xp) {
          await leaderboardService.awardXP(lesson.xp, `Completed ${lesson.title}`);
        }
      } catch (err) {
        console.error("Failed to update progress/XP:", err);
      }
    }
  };

  const askSensei = async () => {
    setIsAskingSensei(true);
    setIsHelpOpen(true);
    try {
      const prompt = `I am stuck on the lesson: "${lesson.title}". My current code is:\n\`\`\`\n${code}\n\`\`\`\nAnd the output is:\n\`\`\`\n${output}\n\`\`\`\nPlease explain why I might be stuck and provide a helpful mentor-like hint without giving the full answer immediately.`;
      const response = await arcadeService.arcadeChat(language, prompt, []);
      setSenseiHelp(response.data.answer);
    } catch (err) {
      setSenseiHelp("Sensei is meditating. Please try again in a moment!");
    } finally {
      setIsAskingSensei(false);
    }
  };

  if (showRoadmap) {
    return <ArcadeRoadmap language={language} progress={currentIdx} onStart={(idx) => {
      setCurrentIdx(idx);
      setShowRoadmap(false);
    }} />;
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-2">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-800 transition-all">
          <ArrowLeft size={18} /> BACK
        </button>
        <div className="flex-1 max-w-md mx-8">
          <ProgressBar current={currentIdx} total={curriculum.length} />
        </div>
        <button 
          onClick={() => setShowRoadmap(true)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs uppercase rounded-xl transition-all"
        >
          MAP
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Side: Lesson Content */}
        <div className="lg:w-[40%] flex flex-col bg-white border-4 border-slate-200 rounded-[2.5rem] shadow-[0_8px_0_theme(colors.slate.200)] overflow-hidden">
          <div className="p-6 border-b-4 border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm">
                <img src="/assets/sensei_avatar.png" alt="Sensei" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 leading-tight">{lesson.title}</h2>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">
                  Lesson {currentIdx + 1}
                </span>
              </div>
            </div>
            <button
               onClick={() => {
                if (isVoiceEnabled) window.speechSynthesis.cancel();
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                isVoiceEnabled ? "bg-amber-100 text-amber-600" : "bg-slate-50 text-slate-400"
              }`}
            >
              {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="prose prose-slate max-w-none prose-p:font-bold prose-p:text-slate-600 prose-p:leading-relaxed">
              <MarkdownRenderer content={lesson.narrative} />
              
              <div className="mt-8 p-6 bg-slate-900 rounded-3xl overflow-hidden relative">
                <div className="absolute top-3 right-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">EXAMPLE</div>
                <code className="text-sky-300 font-mono text-sm whitespace-pre-wrap">{lesson.example}</code>
              </div>

              <div className="mt-8 p-6 bg-amber-50 rounded-3xl border-2 border-amber-100 border-dashed">
                <h4 className="flex items-center gap-2 text-amber-700 font-black uppercase text-xs tracking-widest mb-3">
                  <Target size={16} /> Mission Objective
                </h4>
                <p className="text-amber-900 text-sm font-bold leading-relaxed">{lesson.goal}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t-4 border-slate-100 flex items-center justify-center gap-2">
            <button 
              onClick={askSensei}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-600 font-black uppercase text-xs rounded-2xl border-2 border-slate-200 transition-all active:translate-y-1"
            >
              <HelpCircle size={16} className="text-rose-400" />
              Ask Sensei
            </button>
          </div>
        </div>

        {/* Right Side: Editor & Interaction */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 flex flex-col bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] shadow-[0_8px_0_theme(colors.slate.800)] overflow-hidden">
            <CodeEditor 
              code={code}
              setCode={setCode}
              language={language}
              onRun={handleRunCode}
              onCompileResult={handleCompileResult}
            />
          </div>

          {/* Persistent Help Drawer */}
          {isHelpOpen && (
             <div className="bg-rose-50 border-4 border-rose-100 rounded-[2rem] p-6 relative animate-in slide-in-from-bottom-4">
              <button onClick={() => setIsHelpOpen(false)} className="absolute top-4 right-4 text-rose-300 hover:text-rose-500">
                <ArrowLeft size={20} className="rotate-90" />
              </button>
              <h4 className="text-rose-500 font-black text-xs uppercase mb-2 flex items-center gap-2">
                <Sparkles size={14} /> Sensei's Guidance
              </h4>
              {isAskingSensei ? (
                <div className="flex gap-2 p-2">
                  <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-rose-300 rounded-full animate-bounce delay-150"></div>
                </div>
              ) : (
                <p className="text-rose-900 text-sm font-medium leading-relaxed italic">"{senseiHelp}"</p>
              )}
            </div>
          )}

          {/* Navigation Footer */}
          <div className="flex items-center justify-between gap-4 p-2">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-400 font-black uppercase text-xs rounded-2xl border-2 border-slate-200 disabled:opacity-30 disabled:grayscale transition-all"
            >
              <ChevronLeft size={18} /> Prev
            </button>

            {isCompleted ? (
              <button 
                onClick={async () => {
                  if (currentIdx < curriculum.length - 1) {
                    const nextIdx = currentIdx + 1;
                    setCurrentIdx(nextIdx);
                    try {
                      await arcadeService.updateProgress(nextIdx);
                    } catch (err) {
                      console.error("Failed to update progress:", err);
                    }
                  } else {
                    setShowRoadmap(true);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-5 bg-emerald-400 hover:bg-emerald-500 text-white font-black uppercase text-sm rounded-3xl shadow-[0_6px_0_theme(colors.emerald-600)] active:shadow-none active:translate-y-[6px] transition-all animate-pulse duration-1000"
              >
                Great Job! Next Lesson <ChevronRight size={20} />
              </button>
            ) : (
              <div className="flex-1 py-5 bg-slate-100 text-slate-400 font-black uppercase text-xs rounded-3xl border-2 border-slate-200 border-dashed flex items-center justify-center gap-2">
                <Lock size={16} /> Complete Mission to Advance
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ArcadePage ───
const ArcadePage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] p-6 font-['Outfit',sans-serif]">
        <DojoPathGame 
          language={selectedGame.language} 
          onBack={() => setSelectedGame(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] p-8 font-['Outfit',sans-serif]">
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-5xl font-black text-slate-800 tracking-tight">CodeDojo <span className="text-amber-400 underline decoration-8 decoration-amber-100 underline-offset-8">Arcade</span></h1>
        <p className="mt-4 text-slate-500 font-bold text-lg">Pick your practice arena and start the journey.</p>
      </header>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { id: 'py', title: 'Python', icon: <Code2 size={40} />, color: 'bg-sky-500', shadow: 'shadow-sky-700', language: 'python', desc: 'Snake your way through logic.' },
          { id: 'jv', title: 'Java', icon: <Swords size={40} />, color: 'bg-orange-500', shadow: 'shadow-orange-700', language: 'java', desc: 'Compile your strength.' }
        ].map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className={`${game.color} p-8 rounded-[2.5rem] text-white transition-all transform hover:-translate-y-2 active:translate-y-0 group h-[280px] flex flex-col justify-between shadow-[0_12px_0_rgba(0,0,0,0.2)] hover:shadow-[0_15px_0_rgba(0,0,0,0.2)]`}
          >
            <div className="flex justify-between items-start">
              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                {game.icon}
              </div>
              <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
            
            <div className="text-left">
              <h2 className="text-3xl font-black mb-2">{game.title}</h2>
              <p className="text-white/80 font-bold text-sm leading-relaxed">{game.desc}</p>
            </div>
          </button>
        ))}

        <div className="bg-slate-50 border-4 border-slate-100 border-dashed p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 h-[280px]">
          <Puzzle size={40} className="mb-4 opacity-50" />
          <p className="font-black text-sm uppercase tracking-widest">More Games Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default ArcadePage;
