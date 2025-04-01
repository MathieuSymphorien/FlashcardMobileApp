import api from "./api";

// Récupère tous les mots
export async function fetchWords() {
  const response = await api.get("/english-words");
  return response.data;
}

// Crée un mot
// Le payload attend désormais theme sous forme d'ID (number)
export async function createWord(payload: {
  theme: number;
  word: string;
  translation: string;
}) {
  const response = await api.post("/english-words", payload);
  return response.data;
}

// Met à jour un mot
export async function updateWord(
  id: number,
  payload: {
    theme: number;
    word: string;
    translation: string;
    learningLevel?: number;
  }
) {
  const response = await api.put(`/english-words/${id}`, payload);
  return response.data;
}

// Supprime un mot
export async function deleteWord(id: number) {
  await api.delete(`/english-words/${id}`);
}

// services/word.ts
// export async function fetchWordsByThemeAndLevel(
//   themeId: number,
//   level: number
// ) {
//   const response = await api.get(
//     `/english-words/theme-level?themeId=${themeId}&level=${level}`
//   );
//   return response.data;
// }

// Récupère les mots par thème
export async function fetchWordsByTheme(themeId: number) {
  const response = await api.get(`/theme/${themeId}/words`);
  return response.data;
}

// Récupère les mots par niveau
export async function fetchWordsByLevel(level: number) {
  const response = await api.get(`/english-words/level?level=${level}`);
  return response.data;
}

// Récupère les mots par thème ET niveau
export async function fetchWordsByThemeAndLevel(
  themeId: number,
  level: number
) {
  const response = await api.get(
    `/english-words/theme-level?themeId=${themeId}&level=${level}`
  );
  return response.data;
}

// Met à jour le mot après une révision en fonction du succès de la réponse
export async function updateWordAfterReview(id: number, success: boolean) {
  // Récupérer le mot actuel pour connaître son niveau et son thème
  const wordResponse = await api.get(`/english-words/${id}`);
  const word = wordResponse.data;
  const currentLevel = word.learningLevel || 1;
  // Calcule le nouveau niveau : incrémentation en cas de succès, décrémentation (au minimum 1) sinon
  const newLevel = success ? currentLevel + 1 : Math.max(currentLevel - 1, 1);
  // Met à jour le mot avec le nouveau niveau
  const payload = {
    theme: word.theme, // ici, word.theme est l'ID du thème
    word: word.word,
    translation: word.translation,
    learningLevel: newLevel,
  };
  const response = await api.put(`/english-words/${id}`, payload);
  return response.data;
}
