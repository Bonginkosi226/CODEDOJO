import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, MessageSquare, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useTelemetry } from "../../context/TelemetryContext.jsx";

const CodeEditor = ({ code, setCode, language = "python", setLanguage, onRun, onCompileResult, onSubmitMission, isSubmittingMission = false, output: controlledOutput }) => {
  const { track } = useTelemetry();
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [internalOutput, setInternalOutput] = useState("");
  const output = controlledOutput !== undefined ? controlledOutput : internalOutput;

  const handleEditorChange = (value) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleAskAI = async () => {
    setIsRunning(true);
    track('click', 'CodeEditor', { action: 'Ask AI', language });
    toast.success("Code submitted to AI assistant!");
    
    if (onRun) {
      await onRun(code);
    }
    
    setTimeout(() => {
      setIsRunning(false);
    }, 1000);
  };

  // Free-run path: used when no onSubmitMission is provided (e.g. the document
  // chat editor), hits /api/execute directly and manages its own output state.
  const handleCompile = async () => {
    if (!code || code.trim() === "") return;

    setIsCompiling(true);
    setInternalOutput("Compiling...");
    try {
      const response = await axios.post("http://localhost:8000/api/execute", {
        language: language,
        version: language === "python" ? "3.10.0" : "17.0.2",
        files: [{ content: code }]
      });
      const result = response.data.run.output || "Program finished with no output.";
      setInternalOutput(result);
      track('milestone', 'CodeEditor: Compile Success', { language, outputLength: result.length });
      // Notify parent about the compilation result
      if (onCompileResult) {
        onCompileResult(code, result);
      }
    } catch (error) {
      const errorMsg = "Compilation error: " + (error.response?.data?.message || error.message);
      setInternalOutput(errorMsg);
      track('error', 'CodeEditor: Compile Failure', { language, error: errorMsg });
      if (onCompileResult) {
        onCompileResult(code, errorMsg);
      }
    } finally {
      setIsCompiling(false);
    }
  };

  const handleReset = () => {
    setCode("// Write your " + language + " code here...");
  };

  // Graded path: used on the Arcade lesson screen. Running the code and
  // checking the mission are the same server call — no separate /api/execute hit.
  const handleRunClick = () => {
    if (!code || code.trim() === "") return;

    if (onSubmitMission) {
      if (isSubmittingMission) return;
      track('click', 'CodeEditor', { action: 'Run Code (Mission)', language });
      onSubmitMission(code);
    } else {
      handleCompile();
    }
  };

  const isRunClickBusy = onSubmitMission ? isSubmittingMission : isCompiling;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#404040]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider ml-2">
            CodeDojo IDE
          </span>
          {setLanguage ? (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 font-mono outline-none border border-slate-600 cursor-pointer"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          ) : (
            <span className="px-2 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300 font-mono">
              {language}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Reset Code"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRunClick}
            disabled={isRunClickBusy}
            className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunClickBusy ? (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {onSubmitMission ? "Checking..." : "Compiling..."}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Play size={14} fill="currentColor" />
                Run Code
              </span>
            )}
          </button>
          <button
            onClick={handleAskAI}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Asking...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} fill="currentColor" />
                Ask AI
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
          }}
        />
      </div>

      {/* Output Console area */}
      <div className="h-48 border-t border-slate-700 bg-[#1e1e1e] flex flex-col shrink-0">
        <div className="px-4 py-2 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-slate-400" />
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">Output Console</span>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-black text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
          {output || <span className="text-slate-600 italic">No output yet. Click 'Run Code' to execute.</span>}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
