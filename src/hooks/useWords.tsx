import { useEffect, useState } from "react";

export const useWords = () => {
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    fetch("/words.txt")
      .then(r => r.text())
      .then(t =>
        setWords(
          t.split("\n").map(w => w.trim()).filter(Boolean)
        )
      );
  }, []);

  return words;
};