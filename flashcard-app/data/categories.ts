// data/categories.ts

export interface Word {
  id: string;
  english: string; // Mot en anglais
  french: string; // Traduction en français
}

export interface Category {
  id: string;
  name: string; // Nom de la catégorie
  words: Word[];
}

// Exemple de catégories
export const categories: Category[] = [
  {
    id: "1",
    name: "Verbes",
    words: [
      { id: "1", english: "to eat", french: "manger" },
      { id: "2", english: "to drink", french: "boire" },
      // ...
    ],
  },
  {
    id: "2",
    name: "Expressions",
    words: [
      { id: "1", english: "What’s up?", french: "Quoi de neuf ?" },
      {
        id: "2",
        english: "Break a leg",
        french: "Bonne chance (casse-toi une jambe)",
      },
      // ...
    ],
  },
  {
    id: "3",
    name: "Vocabulaire",
    words: [
      { id: "1", english: "house", french: "maison" },
      { id: "2", english: "car", french: "voiture" },
      // ...
    ],
  },
];

export function getAllWords(): Word[] {
  return categories.flatMap((cat) => cat.words);
}
