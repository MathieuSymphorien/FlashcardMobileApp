// components/WordFormModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { createWord, updateWord, fetchWords } from "@/services/word";
import { fetchThemes } from "@/services/api";
import { EnglishWord } from "@/types/EnglishWord";

interface WordFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingWord: EnglishWord | null;
  onSaveSuccess: (updatedWords: EnglishWord[]) => void;
  existingWords: EnglishWord[];
}

interface Theme {
  id: number;
  theme: string;
}

export default function WordFormModal({
  visible,
  onClose,
  editingWord,
  onSaveSuccess,
}: WordFormModalProps) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Charger les thèmes à chaque ouverture du modal
    fetchThemes()
      .then((data: Theme[]) => {
        setThemes(data);
        // En mode édition, initialiser avec le thème du mot
        if (editingWord && editingWord.theme) {
          setSelectedTheme(editingWord.theme);
        } else if (data.length > 0) {
          // En création, sélectionner par défaut le premier thème
          setSelectedTheme(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des thèmes :", err);
      });

    if (editingWord) {
      setWord(editingWord.word);
      setTranslation(editingWord.translation);
    } else {
      setWord("");
      setTranslation("");
    }
  }, [editingWord, visible]);

  const onSave = async () => {
    if (!word || !translation || selectedTheme === null) {
      setError("Tous les champs sont requis");
      return;
    }
    const payload = { theme: selectedTheme, word, translation };

    try {
      if (editingWord) {
        // Modification : on passe l'id du mot à mettre à jour
        await updateWord(editingWord.id, payload);
      } else {
        // Création
        await createWord(payload);
      }
      // Rafraîchir la liste des mots après sauvegarde
      const updatedWords = await fetchWords();
      onSaveSuccess(updatedWords);
      onClose();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      setError("Erreur lors de l'enregistrement");
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Mot"
          value={word}
          onChangeText={setWord}
          style={styles.input}
        />
        <TextInput
          label="Traduction"
          value={translation}
          onChangeText={setTranslation}
          style={styles.input}
        />
        <Text style={styles.label}>Sélectionner un thème :</Text>
        <View style={styles.themesContainer}>
          {themes.map((t) => (
            <Button
              key={t.id}
              mode={selectedTheme === t.id ? "contained" : "outlined"}
              onPress={() => setSelectedTheme(t.id)}
              style={styles.themeButton}
            >
              {t.theme}
            </Button>
          ))}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button mode="contained" onPress={onSave} style={styles.button}>
          Enregistrer
        </Button>
        <Button mode="outlined" onPress={onClose} style={styles.button}>
          Annuler
        </Button>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  themesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  themeButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
  },
});
