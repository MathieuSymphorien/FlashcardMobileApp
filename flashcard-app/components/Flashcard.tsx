import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface FlashcardProps {
  frontText: string; // mot en anglais
  backText: string; // traduction
}

export default function Flashcard({ frontText, backText }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setFlipped(!flipped)}
      style={styles.cardContainer}
    >
      <View style={[styles.card, flipped && styles.cardFlipped]}>
        <Text style={styles.cardText}>{flipped ? backText : frontText}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  card: {
    width: 250,
    height: 150,
    backgroundColor: "#BEE3F8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cardFlipped: {
    backgroundColor: "#FED7D7",
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
