// app/(tabs)/flashcards.tsx
import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { getAllWords } from "@/data/categories";
import Flashcard from "@/components/Flashcard";

export default function FlashcardsScreen() {
  // Récupère tous les mots de toutes les catégories
  const allWords = getAllWords();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <FlatList
        data={allWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Flashcard frontText={item.english} backText={item.french} />
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
    fontSize: 24,
    marginBottom: 12,
    fontWeight: "bold",
  },
});
