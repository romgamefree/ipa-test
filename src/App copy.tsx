// import { useState } from "react";
// import ESpeakNg from "espeak-ng";

// function App() {
//   const [text, setText] = useState(
//     "I think she is here"
//   );

//   const [ipa, setIpa] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ===== IPA =====
//   const convert = async (voice) => {
//     try {
//       setLoading(true);

//       const espeak = await ESpeakNg({
//         arguments: [
//           "--phonout",
//           "out.txt",
//           "--sep= ",
//           "-q",
//           "--ipa=3",
//           "-v",
//           voice,
//           text,
//         ],
//       });

//       const result =
//         espeak.FS.readFile("out.txt", {
//           encoding: "utf8",
//         });

//       setIpa(result.trim());
//     } catch (err) {
//       console.error(err);
//       setIpa("Error generating IPA");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===== SPEAK =====
//   const speak = (voice) => {
//     if (!("speechSynthesis" in window)) {
//       alert("SpeechSynthesis not supported");
//       return;
//     }

//     const utterance =
//       new SpeechSynthesisUtterance(text);

//     utterance.lang = voice;
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   // ===== COMBO =====
//   const runUS = async () => {
//     await convert("en-us");
//     speak("en-US");
//   };

//   const runUK = async () => {
//     await convert("en-gb");
//     speak("en-GB");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 800,
//         margin: "40px auto",
//         padding: 20,
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h2>IPA Trainer</h2>

//       {/* INPUT */}
//       <textarea
//         value={text}
//         onChange={(e) =>
//           setText(e.target.value)
//         }
//         rows={4}
//         style={{
//           width: "100%",
//           fontSize: 18,
//           padding: 10,
//         }}
//       />

//       {/* BUTTONS */}
//       <div
//         style={{
//           marginTop: 20,
//           display: "flex",
//           gap: 10,
//           flexWrap: "wrap",
//         }}
//       >
//         <button onClick={runUS}>
//           US (IPA + Speak)
//         </button>

//         <button onClick={runUK}>
//           UK (IPA + Speak)
//         </button>

//         <button
//           onClick={() => convert("en-us")}
//         >
//           Only IPA US
//         </button>

//         <button
//           onClick={() => convert("en-gb")}
//         >
//           Only IPA UK
//         </button>
//       </div>

//       {/* OUTPUT */}
//       <div
//         style={{
//           marginTop: 30,
//           fontSize: 28,
//           minHeight: 40,
//         }}
//       >
//         {loading ? "Generating..." : ipa}
//       </div>
//     </div>
//   );
// }

// export default App;