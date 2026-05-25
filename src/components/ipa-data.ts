export type IpaTab =
  | "All"
  | "Vowels"
  | "Long vowels"
  | "Consonants"
  | "Diphthongs"
  | "Stress"
  | "Other";

export const IPA_TABS: IpaTab[] = [
  "All",
  "Vowels",
  "Long vowels",
  "Consonants",
  "Diphthongs",
  "Stress",
  "Other",
];

const VOWELS = ["i", "ɪ", "e", "æ", "ɑ", "ɒ", "ʌ", "ʊ", "u", "ə"];
const LONG_VOWELS = ["iː", "ɑː", "ɔː", "uː", "ɜː"];
const CONSONANTS = [
  "p", "b", "t", "d", "k", "g",
  "f", "v", "θ", "ð", "s", "z",
  "ʃ", "ʒ", "tʃ", "dʒ",
  "m", "n", "ŋ",
  "h", "l", "ɫ",
  "r", "j", "w",
];
const DIPHTHONGS = ["aɪ", "eɪ", "ɔɪ", "aʊ", "əʊ", "oʊ", "ɪə", "eə", "ʊə"];
const STRESS = ["ˈ", "ˌ"];
const OTHER = ["ː", ".", "‿", "ʔ", "ɾ"];

export const IPA_KEYS: Record<IpaTab, string[]> = {
  All: [...VOWELS, ...LONG_VOWELS, ...DIPHTHONGS, ...CONSONANTS, ...STRESS, ...OTHER],
  Vowels: VOWELS,
  "Long vowels": LONG_VOWELS,
  Consonants: CONSONANTS,
  Diphthongs: DIPHTHONGS,
  Stress: STRESS,
  Other: OTHER,
};

export const SAMPLE_SENTENCES = [
  { en: "I think she is here", ipa: "aɪ θɪŋk ʃi ɪz hɪr" },
  { en: "The sun is shining bright", ipa: "ðə sʌn ɪz ʃaɪnɪŋ braɪt" },
  { en: "Could you say that again", ipa: "kʊd ju seɪ ðæt əˈgɛn" },
  { en: "She bought a new book", ipa: "ʃi bɔːt ə nuː bʊk" },
  { en: "They are going to the park", ipa: "ðeɪ ɑːr ˈgoʊɪŋ tə ðə pɑːrk" },
];
