// app/(tabs)/word-list.tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  SectionList,
  Text,
  SectionListData,
} from "react-native";
import { categories, Category, Word } from "@/data/categories";

interface SectionData {
  title: string; // Nom de la catégorie
  data: Word[]; // Tableau de mots
}

export default function WordListScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filtre les catégories selon la search bar,
   * et retourne un tableau de sections adapté à SectionList.
   */
  function getFilteredSections(): SectionData[] {
    // 1) Parcourir chaque catégorie
    // 2) Garder uniquement les mots qui matchent le searchTerm
    // 3) Si une catégorie n’a plus de mots, on l’exclut
    return categories
      .map((cat) => {
        // Filtrage des mots
        const filteredWords = cat.words.filter((word) => {
          const term = searchTerm.toLowerCase();
          return (
            word.english.toLowerCase().includes(term) ||
            word.french.toLowerCase().includes(term)
          );
        });

        return {
          title: cat.name,
          data: filteredWords,
        };
      })
      .filter((section) => section.data.length > 0); // Exclure les catégories vides
  }

  const sections = getFilteredSections();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Mots par Catégorie</Text>

      {/* Barre de recherche */}
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un mot..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* SectionList => chaque section correspond à une catégorie */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.wordItem}>
            <Text style={styles.wordEnglish}>{item.english}</Text>
            <Text style={styles.wordFrench}>{item.french}</Text>
          </View>
        )}
        // S’il n’y a aucun mot à afficher (après filtrage)
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Aucun mot trouvé...</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: "bold",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  sectionHeader: {
    backgroundColor: "#ddd",
    padding: 8,
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    borderRadius: 8,
  },
  wordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  wordEnglish: {
    fontSize: 16,
    fontWeight: "bold",
  },
  wordFrench: {
    fontSize: 16,
    fontStyle: "italic",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
});
