// app/(screens)/WordList.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/services/api";
import { fetchWords, deleteWord } from "@/services/word";
import { fetchThemes } from "@/services/api";
import {
  Text,
  Button,
  Searchbar,
  Card,
  FAB,
  Portal,
  Menu,
} from "react-native-paper";
import WordFormModal from "../components/WordFormModal";
import { EnglishWord } from "@/types/EnglishWord";

export default function WordList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<EnglishWord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [themeMapping, setThemeMapping] = useState<Record<number, string>>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [editingWord, setEditingWord] = useState<EnglishWord | null>(null);

  useEffect(() => {
    async function initApp() {
      try {
        await login("admin", "pGd'tb$EXh,]j]M'=&9Tuk/FqG?Y7ZB%4zo}ZZ67v?L");
        const [allWords, themesData] = await Promise.all([
          fetchWords(),
          fetchThemes(),
        ]);
        setWords(allWords);
        const mapping: Record<number, string> = {};
        themesData.forEach((t: { id: number; theme: string }) => {
          mapping[t.id] = t.theme;
        });
        setThemeMapping(mapping);
      } catch (error) {
        console.error("Erreur login/fetchWords/fetchThemes :", error);
      } finally {
        setIsLoading(false);
      }
    }
    initApp();
  }, []);

  function onSaveSuccess(updatedWords: EnglishWord[]) {
    setWords(updatedWords);
    setModalVisible(false);
    setEditingWord(null);
  }

  function openCreateModal() {
    setEditingWord(null);
    setModalVisible(true);
  }

  function openEditModal(word: EnglishWord) {
    setEditingWord(word);
    setModalVisible(true);
  }

  async function handleDelete(id: number) {
    try {
      await deleteWord(id);
      setWords(words.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  }

  const filteredWords = words.filter((word) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      word.word.toLowerCase().includes(lowerSearch) ||
      word.translation.toLowerCase().includes(lowerSearch);
    const matchesTheme = selectedTheme ? word.theme === selectedTheme : true;
    return matchesSearch && matchesTheme;
  });

  // Récupération des identifiants de thème uniques présents dans les mots
  const themeIds = Array.from(new Set(words.map((word) => word.theme)));

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Rechercher un mot..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchbar}
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.filterButton}
          >
            {selectedTheme ? themeMapping[selectedTheme] : "Filtrer par thème"}
          </Button>
        }
      >
        <Menu.Item
          title="Tous"
          onPress={() => {
            console.log("Filtre réinitialisé");
            setSelectedTheme(null);
            setMenuVisible(false);
          }}
        />
        {themeIds.map((themeId) => (
          <Menu.Item
            key={themeId}
            title={themeMapping[themeId] || themeId.toString()}
            onPress={() => {
              console.log("Sélection du thème", themeId);
              setSelectedTheme(themeId);
              setMenuVisible(false);
            }}
          />
        ))}
      </Menu>

      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.word}
              subtitle={themeMapping[item.theme] || item.theme.toString()}
            />
            <Card.Content>
              <Text>{item.translation}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openEditModal(item)}>Éditer</Button>
              <Button textColor="red" onPress={() => handleDelete(item.id)}>
                Supprimer
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text variant="headlineMedium" style={styles.title}>
              Liste de mots
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/screens/FlashcardGame")}
            >
              Lancer le jeu (Flashcards)
            </Button>
          </View>
        }
      />

      <FAB
        icon="plus"
        label="Ajouter"
        style={styles.fab}
        onPress={openCreateModal}
      />

      <Portal>
        <WordFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          editingWord={editingWord}
          onSaveSuccess={onSaveSuccess}
          existingWords={words}
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchbar: { margin: 16 },
  filterButton: { marginHorizontal: 16, marginBottom: 8 },
  card: { marginHorizontal: 16, marginBottom: 8 },
  title: { marginBottom: 8, fontWeight: "bold" },
  fab: { position: "absolute", right: 16, bottom: 80 },
});
