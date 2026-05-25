import { useEffect, useRef, useState } from "react";
// @ts-ignore
import ESpeakNg from "espeak-ng";
import { IpaKeyboard } from "../components/IpaKeyboard";

function Home() {
  const [text, setText] = useState("I think she is here");

  // default UK
  const [voice, setVoice] = useState<"en-gb" | "en-us">("en-gb");

  const [ipa, setIpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const ipaInputRef = useRef<HTMLInputElement>(null);

  const [userIpa, setUserIpa] = useState("");

  // ===== INSERT IPA =====
  const insertAtCursor = (value: string) => {
    const el = ipaInputRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    const newText =
      userIpa.slice(0, start) +
      value +
      userIpa.slice(end);

    setUserIpa(newText);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + value.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // ===== MOVE CURSOR =====
  const moveCursor = (dir: -1 | 1) => {
    const el = ipaInputRef.current;
    if (!el) return;

    const pos = el.selectionStart ?? 0;

    const newPos = Math.max(
      0,
      Math.min(userIpa.length, pos + dir)
    );

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    });
  };

  // ===== BACKSPACE =====
  const backspace = () => {
    const el = ipaInputRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    if (start !== end) {
      const newText =
        userIpa.slice(0, start) +
        userIpa.slice(end);

      setUserIpa(newText);

      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start);
      });

      return;
    }

    if (start === 0) return;

    const newText =
      userIpa.slice(0, start - 1) +
      userIpa.slice(end);

    setUserIpa(newText);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start - 1, start - 1);
    });
  };

  const clear = () => setUserIpa("");

  const space = () => insertAtCursor(" ");

  // ===== IPA GENERATE =====
  const convert = async (currentText: string, currentVoice: string) => {
    if (!currentText.trim()) {
      setIpa("");
      return;
    }

    try {
      setLoading(true);

      const espeak = await ESpeakNg({
        arguments: [
          "--phonout",
          "out.txt",
          "--sep= ",
          "-q",
          "--ipa=3",
          "-v",
          currentVoice,
          currentText,
        ],
      });

      const result = espeak.FS.readFile("out.txt", {
        encoding: "utf8",
      });

      setIpa(result.trim());
    } catch (err) {
      console.error(err);

      setIpa("Error generating IPA");
    } finally {
      setLoading(false);
    }
  };

  // ===== AUTO CONVERT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      convert(text, voice);
    }, 200);

    return () => clearTimeout(timer);
  }, [text, voice]);

  // ===== SPEAK =====
  const speak = () => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = voice === "en-gb" ? "en-GB" : "en-US";

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(utterance);
  };

  const normalize = (s: string) =>
    s
      .replace(/\u200d/g, "") // remove zero-width joiner
      .trim();

  const renderComparedIpa = () => {
    const cleanIpa = normalize(ipa);
    const cleanUser = normalize(userIpa);

    let errorIndex = -1;

    for (let i = 0; i < cleanUser.length; i++) {
      if (cleanUser[i] !== cleanIpa[i]) {
        errorIndex = i;
        break;
      }
    }

    return cleanIpa.split("").map((char, i) => {
      let color = "text-zinc-500";

      if (i < cleanUser.length) {
        if (errorIndex === -1) {
          color = "text-emerald-400";
        } else {
          color = i < errorIndex ? "text-emerald-400" : "text-red-400";
        }
      }

      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-5 py-10">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">IPA Trainer</h1>

        <div className="flex items-center justify-between">
          {/* ACCENT TOGGLE */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1">
            <button
              onClick={() => setVoice("en-gb")}
              className={`
        px-4 py-1.5 rounded-full text-sm font-medium transition
        ${
          voice === "en-gb"
            ? "bg-white text-black"
            : "text-zinc-400 hover:text-white"
        }
      `}
            >
              UK
            </button>

            <button
              onClick={() => setVoice("en-us")}
              className={`
        px-4 py-1.5 rounded-full text-sm font-medium transition
        ${
          voice === "en-us"
            ? "bg-white text-black"
            : "text-zinc-400 hover:text-white"
        }
      `}
            >
              US
            </button>
          </div>

          {/* PRIMARY ACTION */}
         <button
          onClick={speak}
          className="
            px-6 py-2.5 rounded-full
            bg-emerald-500 text-black
            font-semibold
            hover:bg-emerald-400
            active:scale-[0.98]
            transition
            shadow-md shadow-emerald-500/20
            translate-x-2
          "
        >
          Speak
        </button>
        </div>
      </div>

      {/* TEXTAREA */}
      <textarea
        placeholder="Input English"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="
          w-full
          rounded-2xl
          border
          border-zinc-700
          px-4
          py-3
          text-lg
          outline-none
          focus:outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
        "
      />

      {/* IPA OUTPUT */}
      <div
        className="
          mt-5
          p-5
          min-h-[90px]
        "
      >
        <div className="mb-2 text-sm">
          {voice === "en-gb" ? "UK IPA" : "US IPA"}
        </div>

        <div className="text-3xl leading-relaxed tracking-wide">
          {loading ? "..." : renderComparedIpa()}
        </div>
      </div>

      {/* TYPE IPA HERE */}
      <div className="mt-5">
        <div className="mb-2 text-sm text-zinc-400">Your IPA</div>

        <input
          ref={ipaInputRef}
          value={userIpa}
          onChange={(e) => setUserIpa(e.target.value)}
          className="
            w-full
            rounded-2xl
            border
            px-4
            py-3
            text-2xl
            outline-none
            focus:border-blue-500
          "
          placeholder="Type IPA here..."
        />
      </div>

      {/* KEYBOARD */}
      <div className="mt-8">
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
