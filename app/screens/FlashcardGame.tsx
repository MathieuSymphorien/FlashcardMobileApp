// app/(screens)/FlashcardGame.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Text, Button, Card, Menu } from "react-native-paper";
import {
  fetchWords,
  updateWord,
  fetchWordsByThemeAndLevel,
  fetchWordsByTheme,
  fetchWordsByLevel,
} from "@/services/word";
import { fetchThemes } from "@/services/api";

interface EnglishWord {
  id: number;
  theme: number;
  word: string;
  translation: string;
  learningLevel?: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FlashcardGame() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<EnglishWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [themeMapping, setThemeMapping] = useState<Record<number, string>>({});

  // Filtres pour personnaliser le jeu
  const [menuVisibleTheme, setMenuVisibleTheme] = useState(false);
  const [menuVisibleLevel, setMenuVisibleLevel] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const levelOptions = [1, 2, 3, 4, 5];

  useEffect(() => {
    async function loadData() {
      try {
        let allWords: EnglishWord[] = [];
        if (selectedTheme !== null && selectedLevel !== null) {
          allWords = await fetchWordsByThemeAndLevel(
            selectedTheme,
            selectedLevel
          );
        } else if (selectedTheme !== null) {
          allWords = await fetchWordsByTheme(selectedTheme);
        } else if (selectedLevel !== null) {
          allWords = await fetchWordsByLevel(selectedLevel);
        } else {
          allWords = await fetchWords();
        }
        setWords(shuffleArray(allWords));
        setCurrentIndex(0);
      } catch (error) {
        console.error("Erreur lors du chargement des mots:", error);
      } finally {
        setIsLoading(false);
      }
    }
    async function loadThemes() {
      try {
        const themesData = await fetchThemes();
        const mapping: Record<number, string> = {};
        themesData.forEach((t: { id: number; theme: string }) => {
          mapping[t.id] = t.theme;
        });
        setThemeMapping(mapping);
      } catch (error) {
        console.error("Erreur lors du chargement des thèmes:", error);
      }
    }
    loadData();
    loadThemes();
  }, [selectedTheme, selectedLevel]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement des mots...</Text>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={styles.center}>
        <Menu
          visible={menuVisibleTheme}
          onDismiss={() => setMenuVisibleTheme(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisibleTheme(true)}>
              {selectedTheme ? themeMapping[selectedTheme] : "Thème"}
            </Button>
          }
        >
          <Menu.Item
            title="Tous"
            onPress={() => {
              setSelectedTheme(null);
              setMenuVisibleTheme(false);
            }}
          />
          {Object.keys(themeMapping).map((key) => {
            const id = Number(key);
            return (
              <Menu.Item
                key={id}
                title={themeMapping[id]}
                onPress={() => {
                  setSelectedTheme(id);
                  setMenuVisibleTheme(false);
                }}
              />
            );
          })}
        </Menu>
        <Menu
          visible={menuVisibleLevel}
          onDismiss={() => setMenuVisibleLevel(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisibleLevel(true)}>
              {selectedLevel ? `Niveau ${selectedLevel}` : "Niveau"}
            </Button>
          }
        >
          <Menu.Item
            title="Tous"
            onPress={() => {
              setSelectedLevel(null);
              setMenuVisibleLevel(false);
            }}
          />
          {levelOptions.map((level) => (
            <Menu.Item
              key={level}
              title={`Niveau ${level}`}
              onPress={() => {
                setSelectedLevel(level);
                setMenuVisibleLevel(false);
              }}
            />
          ))}
        </Menu>
        <Text>Aucun mot à afficher pour ces critères</Text>
      </View>
    );
  }

  const currentWord = words[currentIndex];

  const handleResponse = async (success: boolean) => {
    try {
      const currentLevel = currentWord.learningLevel || 1;
      const newLevel = success
        ? currentLevel + 1
        : Math.max(currentLevel - 1, 1);
      await updateWord(currentWord.id, {
        theme: currentWord.theme,
        word: currentWord.word,
        translation: currentWord.translation,
        learningLevel: newLevel,
      });
      setFeedbackMessage(
        success
          ? "Bien joué ! Le mot sera revu selon son nouveau niveau."
          : "Pas grave ! Vous reverrez ce mot bientôt."
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du niveau:", error);
    }
    setTimeout(() => {
      setFeedbackMessage(null);
      goToNextCard();
    }, 1500);
  };

  const goToNextCard = () => {
    setShowTranslation(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("Session terminée", "Vous avez vu tous les mots.", [
        { text: "Retour", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisibleTheme}
          onDismiss={() => setMenuVisibleTheme(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisibleTheme(true)}>
              {selectedTheme ? themeMapping[selectedTheme] : "Thème"}
            </Button>
          }
        >
          <Menu.Item
            title="Tous"
            onPress={() => {
              setSelectedTheme(null);
              setMenuVisibleTheme(false);
            }}
          />
          {Object.keys(themeMapping).map((key) => {
            const id = Number(key);
            return (
              <Menu.Item
                key={id}
                title={themeMapping[id]}
                onPress={() => {
                  setSelectedTheme(id);
                  setMenuVisibleTheme(false);
                }}
              />
            );
          })}
        </Menu>

        <Menu
          visible={menuVisibleLevel}
          onDismiss={() => setMenuVisibleLevel(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisibleLevel(true)}>
              {selectedLevel ? `Niveau ${selectedLevel}` : "Niveau"}
            </Button>
          }
        >
          <Menu.Item
            title="Tous"
            onPress={() => {
              setSelectedLevel(null);
              setMenuVisibleLevel(false);
            }}
          />
          {levelOptions.map((level) => (
            <Menu.Item
              key={level}
              title={`Niveau ${level}`}
              onPress={() => {
                setSelectedLevel(level);
                setMenuVisibleLevel(false);
              }}
            />
          ))}
        </Menu>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleLarge">{currentWord.word}</Text>
          <Text>Niveau : {currentWord.learningLevel || 1}</Text>
          {showTranslation && (
            <Text style={styles.translation}>
              {currentWord.translation} (
              {themeMapping[currentWord.theme] || "Inconnu"})
            </Text>
          )}
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="outlined"
            onPress={() => setShowTranslation(!showTranslation)}
          >
            {showTranslation ? "Masquer" : "Afficher"} la traduction
          </Button>
        </Card.Actions>
      </Card>

      {feedbackMessage && (
        <Text style={styles.feedback}>{feedbackMessage}</Text>
      )}

      {showTranslation && (
        <View style={styles.buttonsRow}>
          <Button
            mode="outlined"
            onPress={() => handleResponse(false)}
            style={[styles.actionButton, { marginRight: 8 }]}
          >
            Je ne connais pas
          </Button>
          <Button
            mode="contained"
            onPress={() => handleResponse(true)}
            style={styles.actionButton}
          >
            Je connais
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 16, justifyContent: "center" },
  card: { marginBottom: 16 },
  cardContent: { alignItems: "center" },
  cardActions: { justifyContent: "center" },
  translation: { marginTop: 8, fontSize: 18 },
  buttonsRow: { flexDirection: "row", justifyContent: "center" },
  actionButton: { flex: 1 },
  feedback: { textAlign: "center", marginBottom: 16, fontStyle: "italic" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
});
