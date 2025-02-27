import { View, StyleSheet, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Flashcard from "@/components/Flashcard";

// Définissons la structure des données
interface CardData {
  id: string;
  front: string; // mot en anglais
  back: string; // traduction
}

export default function FlashcardsScreen() {
  // Exemple de cartes
  const cardsData: CardData[] = [
    { id: "1", front: "apple", back: "pomme" },
    { id: "2", front: "car", back: "voiture" },
    { id: "3", front: "house", back: "maison" },
    { id: "4", front: "cat", back: "chat" },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Mes Flashcards
      </ThemedText>

      <FlatList
        data={cardsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Flashcard frontText={item.front} backText={item.back} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
});
