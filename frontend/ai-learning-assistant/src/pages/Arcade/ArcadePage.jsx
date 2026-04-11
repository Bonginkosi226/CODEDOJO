import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, MessageSquare, Code2, ArrowLeft, Gamepad2, Lock, Swords, Target, Puzzle, Trophy, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";
import CodeEditor from "../../components/common/CodeEditor";
import arcadeService from "../../services/arcadeService";

// ─── Game Card Data ───
const GAMES = [
  {
    id: "crash-course",
    title: "Crash Course",
    subtitle: "Master the Basics",
    description: "A guided journey through programming fundamentals with Sensei.",
    icon: Target,
    gradient: "from-orange-400 to-rose-500",
    shadow: "shadow-orange-500/30",
    border: "border-orange-300",
    available: true,
  },
  {
    id: "bug-hunter",
    title: "Bug Hunter",
    subtitle: "Find & Fix Bugs",
    description: "Spot the errors in broken code snippets and fix them before time runs out.",
    icon: Swords,
    gradient: "from-red-400 to-pink-500",
    shadow: "shadow-red-500/30",
    border: "border-red-300",
    available: false,
  },
  {
    id: "code-puzzle",
    title: "Code Puzzle",
    subtitle: "Arrange the Blocks",
    description: "Drag and drop code blocks into the correct order to solve the puzzle.",
    icon: Puzzle,
    gradient: "from-violet-400 to-purple-500",
    shadow: "shadow-violet-500/30",
    border: "border-violet-300",
    available: false,
  },
  {
    id: "speed-coder",
    title: "Speed Coder",
    subtitle: "Race Against Time",
    description: "Solve rapid-fire coding challenges and climb the leaderboard.",
    icon: Trophy,
    gradient: "from-amber-400 to-yellow-500",
    shadow: "shadow-amber-500/30",
    border: "border-amber-300",
    available: false,
  },
];

// ─── Arcade Gallery ───
const ArcadeGallery = ({ onSelectGame }) => {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-[0_4px_0_theme(colors.rose.600)]">
            <Gamepad2 size={28} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Arcade</h1>
            <p className="text-sm font-bold text-slate-400">Choose your training game</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => game.available && onSelectGame(game.id)}
            disabled={!game.available}
            className={`group relative text-left bg-white border-4 ${game.available ? game.border : 'border-slate-200'} rounded-[2rem] p-6 shadow-[0_6px_0_theme(colors.slate.200)] ${game.available ? 'hover:shadow-[0_2px_0_theme(colors.slate.200)] hover:translate-y-[4px] cursor-pointer' : 'opacity-70 cursor-not-allowed'} transition-all duration-200`}
          >
            {!game.available && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
                <Lock size={12} className="text-slate-400" />
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Coming Soon</span>
              </div>
            )}
            <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${game.gradient} flex items-center justify-center text-white mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)] ${game.available ? 'group-hover:scale-110' : ''} transition-transform duration-300`}>
              <game.icon size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-0.5">{game.title}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{game.subtitle}</p>
            <p className="text-sm text-slate-500 leading-snug">{game.description}</p>
            {game.available && (
              <div className="mt-4 w-full py-2.5 bg-gradient-to-br from-orange-400 to-rose-500 text-white text-sm font-black rounded-xl text-center shadow-[0_3px_0_theme(colors.rose.600)] group-hover:shadow-[0_1px_0_theme(colors.rose.600)] group-hover:translate-y-[2px] transition-all">
                PLAY NOW
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Language Picker ───
const LanguagePicker = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white mb-6 shadow-[0_6px_0_theme(colors.rose.600)]">
        <Target size={40} strokeWidth={3} />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">Crash Course</h2>
      <p className="text-sm font-bold text-slate-400 mb-8">Pick your weapon of choice</p>
      <div className="flex gap-6">
        {[
          { lang: "python", label: "Python", emoji: "🐍", gradient: "from-sky-400 to-blue-500", shadow: "shadow-blue-500/30" },
          { lang: "java", label: "Java", emoji: "☕", gradient: "from-orange-400 to-red-500", shadow: "shadow-red-500/30" },
        ].map((opt) => (
          <button
            key={opt.lang}
            onClick={() => onSelect(opt.lang)}
            className={`group flex flex-col items-center gap-3 p-8 bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_6px_0_theme(colors.slate.200)] hover:shadow-[0_2px_0_theme(colors.slate.200)] hover:translate-y-[4px] transition-all duration-200 min-w-[160px]`}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">{opt.emoji}</span>
            <span className="text-xl font-black text-slate-800">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Crash Course Roadmap ───
const CURRICULUM_STEPS = [
  "Hello World",
  "Variables",
  "Operators",
  "Strings",
  "Input",
  "Conditionals",
  "Loops",
  "Functions",
  "Data Structures",
  "OOP",
];

const ArcadeRoadmap = ({ language, progress = 0, onStart }) => {
  return (
    <div className="flex flex-col h-[75vh] bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_6px_0_theme(colors.slate.200)] flex-1 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      
      <div className="relative z-10 p-8 border-b-4 border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Gamepad2 className="text-orange-500" />
            {language === 'python' ? 'Python' : 'Java'} Crash Course
          </h2>
          <p className="text-slate-500 font-bold text-sm mt-1">Sensei's Curriculum Path</p>
        </div>
        <button
          onClick={onStart}
          className="px-6 py-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black rounded-2xl shadow-[0_4px_0_theme(colors.orange.600)] hover:shadow-[0_2px_0_theme(colors.orange.600)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
        >
          {progress === 0 ? "Start Journey" : "Continue Journey"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-4">
          {CURRICULUM_STEPS.map((step, index) => {
            const isCompleted = index < progress;
            const isCurrent = index === progress;
            const isLocked = index > progress;

            let badgeColor = "bg-slate-100 text-slate-400 border-slate-200";
            if (isCompleted) badgeColor = "bg-green-100 text-green-500 border-green-200";
            if (isCurrent) badgeColor = "bg-amber-100 text-amber-500 border-amber-200 animate-pulse";

            return (
              <div 
                key={step} 
                className={`relative flex items-center gap-6 p-4 rounded-2xl border-4 transition-all duration-300 ${
                  isCurrent ? 'bg-white border-amber-300 shadow-md transform scale-105' : 
                  isCompleted ? 'bg-slate-50 border-green-200 opacity-70' : 
                  'bg-slate-50 border-slate-100 opacity-50'
                }`}
              >
                {/* Connecting Line */}
                {index !== CURRICULUM_STEPS.length - 1 && (
                  <div className={`absolute top-full left-[2.25rem] w-1 h-4 -mt-1 ${isCompleted ? 'bg-green-300' : 'bg-slate-200'}`}></div>
                )}
                
                <div className={`w-12 h-12 shrink-0 rounded-2xl border-4 flex items-center justify-center font-black ${badgeColor}`}>
                  {isCompleted ? <Target size={20} /> : index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-black ${isCurrent ? 'text-amber-600' : isCompleted ? 'text-green-600' : 'text-slate-500'}`}>
                    {step}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {isCompleted ? "Completed" : isCurrent ? "Active Mission" : "Locked"}
                  </p>
                </div>

                {isCompleted && (
                  <div className="shrink-0 text-green-500 bg-green-50 p-2 rounded-xl">
                    <Star size={16} className="fill-green-500" />
                  </div>
                )}
                {isLocked && <Lock size={16} className="text-slate-300 mr-4" />}
                {isCurrent && (
                  <button 
                    onClick={onStart}
                    className="shrink-0 bg-amber-400 hover:bg-amber-500 text-white text-xs font-black uppercase px-4 py-2 rounded-xl shadow-[0_2px_0_theme(colors.amber.600)] hover:translate-y-[1px] hover:shadow-[0_1px_0_theme(colors.amber.600)] transition-all"
                  >
                    Play
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// ─── Crash Course Game ───
const CrashCourseGame = ({ language, onBack }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(language === "python" ? "# Write your code here...\n" : "// Write your code here...\n");
  const [editorLanguage, setEditorLanguage] = useState(language);
  const [showEditor, setShowEditor] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [arcadeProgress, setArcadeProgress] = useState(0); 
  const messagesEndRef = useRef(null);

  // Auto-start: AI sends the first lesson if history is empty and roadmap is bypassed
  useEffect(() => {
    if (!showRoadmap && history.length === 0) {
      const startLesson = async () => {
        setLoading(true);
        try {
          const response = await arcadeService.arcadeChat(
            language,
            "I'm ready! Please give me a warm Sensei welcome and start teaching the first concept immediately.",
            []
          );
          const assistantMessage = {
            role: "assistant",
            content: response.data.answer,
            timestamp: new Date(),
          };
          setHistory([assistantMessage]);
        } catch (error) {
          console.error("Arcade start error:", error);
          setHistory([{ role: "assistant", content: "Oops! Sensei couldn't connect. Please try refreshing the page.", timestamp: new Date() }]);
        } finally {
          setLoading(false);
        }
      };
      startLesson();
    }
  }, [language, showRoadmap, history.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message, timestamp: new Date() };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    setMessage("");
    setLoading(true);

    try {
      const response = await arcadeService.arcadeChat(language, message, newHistory);
      const assistantMessage = { role: "assistant", content: response.data.answer, timestamp: new Date() };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Arcade chat error:", error);
      setHistory((prev) => [...prev, { role: "assistant", content: "Sensei ran into an issue. Try again!", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${isUser ? "justify-end" : ""}`}
      >
        {!isUser && (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-[0_3px_0_theme(colors.rose.600)] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl shadow-sm ${
            isUser
              ? "bg-sky-400 text-white border-b-4 border-sky-600 rounded-br-md"
              : "bg-white border-2 border-slate-200 text-slate-800 rounded-bl-md"
          }`}
        >
          {isUser ? (
            <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-slate">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 shadow-[0_3px_0_theme(colors.indigo.600)] flex items-center justify-center text-white font-black text-sm shrink-0">
            {user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Arcade
        </button>
        {!showRoadmap && (
          <button
            onClick={() => setShowRoadmap(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-xl text-xs font-black uppercase transition-colors"
          >
            <Gamepad2 size={14} />
            View Roadmap
          </button>
        )}
      </div>

      {showRoadmap ? (
        <ArcadeRoadmap 
          language={language} 
          progress={arcadeProgress}
          onStart={() => setShowRoadmap(false)} 
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 flex-1 h-[75vh]">
          {/* Chat Area */}
          <div className={`flex flex-col flex-1 bg-white border-4 border-slate-200 rounded-[2rem] shadow-[0_6px_0_theme(colors.slate.200)] overflow-hidden ${!showEditor ? 'lg:w-full' : ''}`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-slate-100">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-orange-500" /> Sensei
                <span className="text-xs font-bold text-slate-400 uppercase ml-1">
                  ({language})
                </span>
              </h3>
              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border-b-4 transition-all active:translate-y-[2px] active:border-b-[2px] ${
                  showEditor
                    ? "bg-sky-400 text-white border-sky-600"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                <Code2 size={14} />
                {showEditor ? "Hide Editor" : "Show Editor"}
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {history.map(renderMessage)}
              <div ref={messagesEndRef} />

              {loading && (
                <div className="flex items-center gap-3 my-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border-2 border-slate-200">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t-4 border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your answer or ask Sensei a question..."
                  className="flex-1 h-12 px-4 border-4 border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-bold transition-all duration-200 focus:outline-none focus:border-sky-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="shrink-0 w-12 h-12 bg-sky-400 hover:bg-sky-500 active:translate-y-[2px] text-white rounded-2xl transition-all duration-200 shadow-[0_4px_0_theme(colors.sky.600)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>

          {/* Code Editor */}
          {showEditor && (
            <div className="hidden lg:flex flex-1 flex-col h-full">
              <CodeEditor
                code={code}
                setCode={setCode}
                language={editorLanguage}
                setLanguage={setEditorLanguage}
                onRun={async (currentCode) => {
                  const promptMsg = "Sensei, please review my code:\n\n```" + editorLanguage + "\n" + currentCode + "\n```";
                  const userMessage = { role: "user", content: promptMsg, timestamp: new Date() };
                  const newHistory = [...history, userMessage];
                  setHistory(newHistory);
                  setLoading(true);

                  try {
                    const response = await arcadeService.arcadeChat(language, promptMsg, newHistory);
                    const assistantMessage = { role: "assistant", content: response.data.answer, timestamp: new Date() };
                    setHistory((prev) => [...prev, assistantMessage]);
                  } catch (error) {
                    console.error("Arcade code review error:", error);
                    setHistory((prev) => [...prev, { role: "assistant", content: "Sensei couldn't review your code. Try again!", timestamp: new Date() }]);
                  } finally {
                    setLoading(false);
                  }
                }}
                onCompileResult={async (compiledCode, compilationOutput) => {
                  // Auto-send compilation results to Sensei
                  const promptMsg = "[COMPILATION OUTPUT]\n\nMy code:\n```" + editorLanguage + "\n" + compiledCode + "\n```\n\nOutput:\n```\n" + compilationOutput + "\n```";
                  const userMessage = { role: "user", content: promptMsg, timestamp: new Date() };
                  const newHistory = [...history, userMessage];
                  setHistory(newHistory);
                  setLoading(true);

                  try {
                    const response = await arcadeService.arcadeChat(language, promptMsg, newHistory);
                    const aiAnswer = response.data.answer;
                    
                    const assistantMessage = { role: "assistant", content: aiAnswer, timestamp: new Date() };
                    setHistory((prev) => [...prev, assistantMessage]);

                    // Check if AI congratulates user to advance them and give XP
                    if (aiAnswer.includes("🎉") || aiAnswer.toLowerCase().includes("great job") || aiAnswer.toLowerCase().includes("correct")) {
                      try {
                        import("../../services/leaderboardService").then((module) => {
                          module.default.awardXP(50, "Completing Arcade Challenge").then((xpRes) => {
                            if (xpRes.success) {
                              setArcadeProgress(prev => prev + 1);
                              console.log("Awarded XP:", xpRes.data);
                            }
                          });
                        });
                      } catch (xpErr) {
                        console.error("Failed to auto-award XP:", xpErr);
                      }
                    }

                  } catch (error) {
                    console.error("Arcade auto-review error:", error);
                    setHistory((prev) => [...prev, { role: "assistant", content: "Sensei couldn't analyze your output. Try again!", timestamp: new Date() }]);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Arcade Page ───
const ArcadePage = () => {
  const [currentView, setCurrentView] = useState("gallery"); // gallery | pick-language | crash-course
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleSelectGame = (gameId) => {
    if (gameId === "crash-course") {
      setCurrentView("pick-language");
    }
  };

  const handleSelectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setCurrentView("crash-course");
  };

  const handleBack = () => {
    setCurrentView("gallery");
    setSelectedLanguage(null);
  };

  if (currentView === "crash-course" && selectedLanguage) {
    return <CrashCourseGame language={selectedLanguage} onBack={handleBack} />;
  }

  if (currentView === "pick-language") {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Arcade
        </button>
        <LanguagePicker onSelect={handleSelectLanguage} />
      </div>
    );
  }

  return <ArcadeGallery onSelectGame={handleSelectGame} />;
};

export default ArcadePage;
