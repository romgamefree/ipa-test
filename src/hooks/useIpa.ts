import { useState, useCallback } from "react";
import type { RefObject } from "react";
// @ts-ignore
import ESpeakNg from "espeak-ng";

export interface UseIpaOptions {
  initialVoice?: "en-gb" | "en-us";
  initialShowIpa?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function useIpa(options: UseIpaOptions = {}) {
  const {
    initialVoice = "en-gb",
    initialShowIpa = false,
    inputRef,
  } = options;

  const [ipa, setIpa] = useState("");
  const [userIpa, setUserIpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);
  const [hideStress, setHideStress] = useState(false);
  const [showIPA, setShowIPA] = useState(initialShowIpa);
  const [voice, setVoice] = useState<"en-gb" | "en-us">(initialVoice);

  const formatIpaText = useCallback((s: string) => {
    if (!hideStress) return s;
    return s.replace(/[ˈˌ]/g, "");
  }, [hideStress]);

  const normalize = useCallback((s: string, stripSpaces = false) => {
    let normalized = s.replace(/\u200d/g, ""); // remove zero-width joiner
    if (stripSpaces) {
      normalized = normalized.replace(/\s/g, "");
    }
    return normalized.trim();
  }, []);

  const generateIpa = useCallback(async (text: string, customVoice?: "en-gb" | "en-us") => {
    const currentVoice = customVoice || voice;
    if (!text.trim()) {
      setIpa("");
      return;
    }

    try {
      setLoading(true);

      const args = ["--phonout", "out.txt", "-q", "--ipa=3", "-v", currentVoice, text];

      const espeak = await ESpeakNg({
        arguments: args,
      });

      const res = espeak.FS.readFile("out.txt", {
        encoding: "utf8",
      });

      setIpa(res.trim());
    } catch (err) {
      console.error(err);
      setIpa("Error generating IPA");
    } finally {
      setLoading(false);
    }
  }, [voice]);

  const check = useCallback((stripSpaces = false) => {
    const targetRaw = hideStress ? formatIpaText(ipa) : ipa;
    const isCorrect = normalize(userIpa, stripSpaces) === normalize(targetRaw, stripSpaces);
    setResult(isCorrect);
    setShowIPA(true);
    return isCorrect;
  }, [ipa, userIpa, hideStress, formatIpaText, normalize]);

  const reset = useCallback((clearIpa = false) => {
    setUserIpa("");
    setResult(null);
    if (clearIpa) {
      setIpa("");
    }
  }, []);

  // Keyboard operations
  const insertAtCursor = useCallback((value: string) => {
    if (!inputRef || !inputRef.current) return;
    const el = inputRef.current;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    const newText = userIpa.slice(0, start) + value + userIpa.slice(end);
    setUserIpa(newText);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + value.length;
      el.setSelectionRange(pos, pos);
    });
  }, [inputRef, userIpa]);

  const moveCursor = useCallback((dir: -1 | 1) => {
    if (!inputRef || !inputRef.current) return;
    const el = inputRef.current;

    const pos = el.selectionStart ?? 0;
    const newPos = Math.max(0, Math.min(userIpa.length, pos + dir));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newPos, newPos);
    });
  }, [inputRef, userIpa]);

  const backspace = useCallback(() => {
    if (!inputRef || !inputRef.current) return;
    const el = inputRef.current;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;

    if (start !== end) {
      const newText = userIpa.slice(0, start) + userIpa.slice(end);
      setUserIpa(newText);

      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start);
      });
      return;
    }

    if (start === 0) return;

    const newText = userIpa.slice(0, start - 1) + userIpa.slice(end);
    setUserIpa(newText);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start - 1, start - 1);
    });
  }, [inputRef, userIpa]);

  const clear = useCallback(() => {
    setUserIpa("");
  }, []);

  const space = useCallback(() => {
    insertAtCursor(" ");
  }, [insertAtCursor]);

  return {
    ipa,
    setIpa,
    userIpa,
    setUserIpa,
    loading,
    setLoading,
    result,
    setResult,
    hideStress,
    setHideStress,
    showIPA,
    setShowIPA,
    voice,
    setVoice,
    formatIpaText,
    normalize,
    generateIpa,
    check,
    reset,
    insertAtCursor,
    moveCursor,
    backspace,
    clear,
    space,
  };
}
