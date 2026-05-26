import { useEffect, useRef, useState } from "react";
import { IpaKeyboard } from "../components/IpaKeyboard";
import { useIpa } from "../hooks/useIpa";
import ReactCountryFlag from "react-country-flag";

function Home() {
  const [text, setText] = useState("I think she is here");
  const [collapsed, setCollapsed] = useState(false);
  const ipaInputRef = useRef<HTMLInputElement>(null);

  const {
    ipa,
    userIpa,
    setUserIpa,
    loading,
    result,
    setResult,
    hideStress,
    setHideStress,
    showIPA,
    setShowIPA,
    voice,
    setVoice,
    formatIpaText,
    generateIpa,
    check,
    insertAtCursor,
    moveCursor,
    backspace,
    clear,
    space,
  } = useIpa({
    initialVoice: "en-gb",
    initialShowIpa: true,
    inputRef: ipaInputRef,
  });

  // ===== AUTO CONVERT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      generateIpa(text, voice);
    }, 200);

    return () => clearTimeout(timer);
  }, [text, voice, generateIpa]);

  // ===== SPEAK =====
  const speakVoice = (selectedVoice: "en-gb" | "en-us") => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice === "en-gb" ? "en-GB" : "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    setResult(null);
  }, [text, voice, setResult]);

  // Shared button styles
  const btnBase =
    "px-4 py-2.5 rounded-xl font-medium transition-all duration-150 " +
    "active:scale-[0.97] active:translate-y-[1px] " +
    "focus:outline-none focus:ring-2 focus:ring-zinc-400/40";

  return (
    <div className="max-w-5xl mx-auto p-5 py-10 flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">IPA Sentence Trainer</h1>
          <p className="text-zinc-400 text-sm mt-1">Convert English sentences to IPA and practice typing them.</p>
        </div>
      </div>

      {/* INPUT SENTENCE AREA */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-400">English Text</label>
        <textarea
          placeholder="Input English sentence..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-zinc-500 transition-all"
        />
        <div className="flex gap-3 justify-start">
          <button
            onClick={() => {
              setVoice("en-gb");
              speakVoice("en-gb");
            }}
            disabled={!text.trim()}
            className={`${btnBase} ${voice === "en-gb"
              ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold"
              : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              } flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ReactCountryFlag countryCode="GB" svg /> UK Speak
          </button>
          <button
            onClick={() => {
              setVoice("en-us");
              speakVoice("en-us");
            }}
            disabled={!text.trim()}
            className={`${btnBase} ${voice === "en-us"
              ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 font-bold"
              : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              } flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <ReactCountryFlag countryCode="US" svg /> US Speak
          </button>
        </div>
      </div>

      {/* IPA TARGET CARD */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-zinc-400">Target IPA</label>
        <div className="flex items-center justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl min-h-[90px]">
          <div
            className={`text-2xl md:text-3xl leading-relaxed tracking-wide font-mono font-semibold transition-colors duration-200 ${loading
              ? "text-zinc-400"
              : !showIPA
                ? "text-zinc-500"
                : result === null
                  ? "text-zinc-500"
                  : result
                    ? "text-green-400"
                    : "text-red-400"
              }`}
          >
            {loading ? "Converting..." : showIPA ? formatIpaText(ipa) : "••••"}
          </div>
        </div>

        {/* VISIBILITY CHECKBOXES BELOW IPA */}
        <div className="flex gap-6 items-center mt-2 text-zinc-400">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm hover:text-zinc-200 transition">
            <input
              type="checkbox"
              checked={showIPA}
              onChange={(e) => setShowIPA(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 cursor-pointer"
            />
            <span>Show IPA</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm hover:text-zinc-200 transition">
            <input
              type="checkbox"
              checked={hideStress}
              onChange={(e) => setHideStress(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 cursor-pointer"
            />
            <span>Hide Stress</span>
          </label>
        </div>
      </div>

      {/* TYPE IPA HERE */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-400">Your Answer</label>
          {result !== null && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${result ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
            >
              {result ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>

        <input
          ref={ipaInputRef}
          value={userIpa}
          onChange={(e) => setUserIpa(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-zinc-500 transition-all font-mono"
          placeholder="Type IPA here..."
        />
      </div>

      {/* ACTION CONTROLS */}
      <div className="flex gap-2">
        <button
          onClick={() => check()}
          className={`${btnBase} bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-md shadow-blue-500/20 px-6`}
        >
          Check
        </button>
      </div>

      {/* KEYBOARD */}
      <div className="mt-4 border-t border-zinc-800 pt-6">
        <IpaKeyboard
          onInsert={insertAtCursor}
          onMove={moveCursor}
          onBackspace={backspace}
          onClear={clear}
          onSpace={space}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>
    </div>
  );
}

export default Home;
