import { useRef, useState } from "react";
// @ts-ignore
import ESpeakNg from "espeak-ng";
import { IpaKeyboard } from "./IpaKeyboard";

function App() {
  const [text, setText] = useState("I think she is here");
  const [ipa, setIpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ===== INSERT IPA =====
  const insertAtCursor = (value: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    const newText =
      text.slice(0, start) + value + text.slice(end);

    setText(newText);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + value.length;
      el.setSelectionRange(pos, pos);
    });
  };

  // ===== MOVE CURSOR =====
  const moveCursor = (dir: -1 | 1) => {
    const el = textareaRef.current;
    if (!el) return;

    const pos = el.selectionStart ?? 0;
    const newPos = Math.max(0, Math.min(text.length, pos + dir));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    });
  };

  // ===== BACKSPACE =====
  const backspace = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    if (start !== end) {
      const newText =
        text.slice(0, start) + text.slice(end);
      setText(newText);

      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start);
      });
      return;
    }

    if (start === 0) return;

    const newText =
      text.slice(0, start - 1) + text.slice(end);

    setText(newText);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start - 1, start - 1);
    });
  };

  const clear = () => setText("");
  const space = () => insertAtCursor(" ");

  // ===== IPA GENERATE =====
  const convert = async (voice: string) => {
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
          voice,
          text,
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

  // ===== SPEAK =====
  const speak = (voice: string) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const runUS = async () => {
    await convert("en-us");
    speak("en-US");
  };

  const runUK = async () => {
    await convert("en-gb");
    speak("en-GB");
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h2>IPA Trainer</h2>

      {/* TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          fontSize: 18,
          padding: 10,
          marginTop: 10,
        }}
      />

      {/* BUTTONS */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={runUS}>US (IPA + Speak)</button>
        <button onClick={runUK}>UK (IPA + Speak)</button>
        <button onClick={() => convert("en-us")}>Only IPA US</button>
        <button onClick={() => convert("en-gb")}>Only IPA UK</button>
      </div>

      {/* IPA OUTPUT */}
      <div style={{ marginTop: 20, fontSize: 26 }}>
        {loading ? "Generating..." : ipa}
      </div>

      {/* KEYBOARD */}
      <div style={{ marginTop: 30 }}>
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

export default App;