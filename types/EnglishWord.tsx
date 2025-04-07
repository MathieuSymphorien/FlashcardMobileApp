// types/EnglishWord.ts
export interface EnglishWord {
  id: number;
  theme: number; // L'ID du thème (en accord avec l'API)
  word: string;
  translation: string;
  learningLevel?: number;
}
