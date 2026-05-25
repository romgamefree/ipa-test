import { useEffect, useRef, useState } from "react";
// @ts-ignore
import ESpeakNg from "espeak-ng";
import { IpaKeyboard } from "../components/IpaKeyboard";

type WordItem = {
  id: number;
  word: string;
};

export default function Practice() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [index, setIndex] = useState(0);

  const [ipa, setIpa] = useState("");
  const [userIpa, setUserIpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);

  const [showIPA, setShowIPA] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const current = words[index];

  // ===== LOAD WORDS =====
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/words.txt");
      const text = await res.text();

      const list = text
        .split("\n")
        .map((w) => w.trim())
        .filter(Boolean)
        .map((word, i) => ({ id: i, word }));

      setWords(list);
    };

    load();
  }, []);

  // ===== GENERATE IPA =====
  const generateIPA = async (word: string) => {
    setLoading(true);

    const espeak = await ESpeakNg({
      arguments: ["--phonout", "out.txt", "-q", "--ipa=3", "-v", "en-gb", word],
    });

    const result = espeak.FS.readFile("out.txt", {
      encoding: "utf8",
    });

    setIpa(result.trim());
    setLoading(false);
  };

  // generate when word changes
  useEffect(() => {
    if (current?.word) {
      setUserIpa("");
      setResult(null);
      generateIPA(current.word);
    }
  }, [current]);

  // ===== CHECK =====
  const normalize = (s: string) => s.replace(/\s/g, "").replace(/\u200d/g, "");

  const check = () => {
    setResult(normalize(userIpa) === normalize(ipa));
  };

  // ===== NEXT / PREV =====
  const next = () => {
    setIndex((i) => Math.min(i + 1, words.length - 1));
  };

  const prev = () => {
    setIndex((i) => Math.max(i - 1, 0));
  };

  // ===== RANDOM =====
  const random = () => {
    if (words.length === 0) return;

    let r = index;
    while (r === index && words.length > 1) {
      r = Math.floor(Math.random() * words.length);
    }

    setIndex(r);
  };

  // ===== SPEAK =====
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    if (!current?.word) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(current.word);

    utterance.lang = "en-GB";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!current) return <div>Loading words...</div>;

  const ipaColor =
    result === null
      ? "text-zinc-900"
      : result
        ? "text-green-400"
        : "text-red-400";

  const btnBase =
    "px-4 py-2 rounded-xl font-medium transition-all duration-150 " +
    "active:scale-[0.97] active:translate-y-[1px] " +
    "focus:outline-none focus:ring-2 focus:ring-zinc-400/40";

  return (
    <div className="max-w-5xl mx-auto p-5 py-10">
      {/* WORD */}
      <div className="text-3xl font-bold mb-2">{current.word}</div>

      {/* IPA + SPEAK */}
      <div className="text-xl text-zinc-200 mb-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIPA((v) => !v)}
            className={`
      ${btnBase}
      bg-zinc-800 text-zinc-100
      hover:bg-zinc-700
    `}
          >
            {showIPA ? "Hide IPA" : "Show IPA"}
          </button>

          <span
            className="
    font-mono text-lg font-semibold tracking-wide
    text-zinc-900
  "
          >
            {loading ? "Generating IPA..." : showIPA ? ipa : "****"}
          </span>
        </div>

        {/* RIGHT SPEAK */}
        <button
          onClick={speak}
          disabled={!current?.word}
          className={`
            px-6 py-2.5 rounded-full
            font-semibold
            transition-all duration-150
            shadow-md shadow-emerald-500/20

            ${
              isSpeaking
                ? "bg-emerald-400 animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-400"
            }

            text-black
            active:scale-[0.97]
            active:translate-y-[1px]

            disabled:opacity-40 disabled:cursor-not-allowed
          `}
        >
          {isSpeaking ? "Speaking..." : "Speak"}
        </button>
      </div>

      {/* INPUT */}
      <input
        ref={inputRef}
        value={userIpa}
        onChange={(e) => setUserIpa(e.target.value)}
        className="w-full border rounded-xl p-3 text-xl mb-3"
        placeholder="Type IPA here..."
      />

      {/* BUTTONS */}
      <div className="flex gap-2 mb-4">
        {/* CHECK */}
        <button
          onClick={check}
          className={`
            ${btnBase}
            bg-blue-500 text-white
            hover:bg-blue-400
            shadow-md shadow-blue-500/20
          `}
        >
          Check
        </button>

        {/* PREV */}
        <button
          onClick={prev}
          className={`
            ${btnBase}
            bg-zinc-200 text-black
            hover:bg-zinc-300
            shadow-sm
          `}
        >
          Prev
        </button>

        {/* NEXT */}
        <button
          onClick={next}
          className={`
            ${btnBase}
            bg-zinc-200 text-black
            hover:bg-zinc-300
            shadow-sm
          `}
        >
          Next
        </button>

        {/* RANDOM */}
        <button
          onClick={random}
          className={`
            ${btnBase}
            bg-purple-500 text-white
            hover:bg-purple-400
            shadow-md shadow-purple-500/20
          `}
        >
          Random
        </button>
      </div>

      {/* KEYBOARD */}
      <IpaKeyboard
        onInsert={(v) => {
          const el = inputRef.current;
          if (!el) return;

          const start = el.selectionStart ?? 0;
          const end = el.selectionEnd ?? 0;

          const newText = userIpa.slice(0, start) + v + userIpa.slice(end);

          setUserIpa(newText);

          requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + v.length, start + v.length);
          });
        }}
        onMove={(dir) => {
          const el = inputRef.current;
          if (!el) return;

          const pos = el.selectionStart ?? 0;
          const newPos = Math.max(0, pos + dir);

          requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(newPos, newPos);
          });
        }}
        onBackspace={() => {
          const el = inputRef.current;
          if (!el) return;

          const start = el.selectionStart ?? 0;

          if (start === 0) return;

          setUserIpa(userIpa.slice(0, start - 1) + userIpa.slice(start));
        }}
        onClear={() => setUserIpa("")}
        onSpace={() => setUserIpa(userIpa + " ")}
        collapsed={false}
        setCollapsed={() => {}}
      />
    </div>
  );
}
