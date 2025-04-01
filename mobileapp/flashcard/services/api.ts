import axios from "axios";

// 1) Créez une instance axios
const api = axios.create({
  baseURL: "https://english.mathieu-symphorien.fr",
});

// 2) Variable pour stocker le token en mémoire
let jwtToken: string | null = null;

// 3) Fonction pour mettre à jour le token
export function setAuthToken(token: string) {
  jwtToken = token;
  // Ajoute automatiquement le header Authorization pour toute requête
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 4) Fonction pour récupérer le token actuel (optionnel)
export function getAuthToken() {
  return jwtToken;
}

interface AuthResponse {
  token: string;
}

export async function login(username: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/login", {
    username,
    password,
  });
  // On récupère le token depuis la réponse
  const { token } = response.data;
  // On le stocke dans notre instance axios
  setAuthToken(token);
  return token;
}

// Nouveaux appels API :

// Met à jour et récupère le streak de l'utilisateur
export async function updateStreak(userId: number) {
  const response = await api.post(`/user/streak/${userId}`);
  return response.data;
}

// Récupère les statistiques globales (supposons qu'un endpoint existe)
export async function getStats() {
  const response = await api.get("/english-words/stats");
  return response.data;
}

// Récupère la liste des thèmes
export async function fetchThemes() {
  const response = await api.get("/theme");
  return response.data;
}

// Récupérer un thème par son ID
export async function fetchTheme(id: number) {
  const response = await api.get(`/theme/${id}`);
  return response.data;
}

// Mettre à jour un thème
export async function updateTheme(id: number, payload: { theme: string }) {
  const response = await api.put(`/theme/${id}`, payload);
  return response.data;
}

// Supprimer un thème
export async function deleteTheme(id: number) {
  await api.delete(`/theme/${id}`);
}

export async function createTheme(payload: { theme: string }) {
  const response = await api.post("/theme", payload);
  return response.data;
}

// 6) Export de l'instance axios pour l’utiliser partout dans l’app
export default api;
