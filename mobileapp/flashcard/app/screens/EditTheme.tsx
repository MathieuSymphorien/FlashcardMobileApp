// app/(screens)/EditTheme.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card, TextInput, Button, Text } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchTheme, updateTheme, deleteTheme } from "@/services/api";

interface ThemeDTO {
  id: number;
  theme: string;
}

export default function EditTheme() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // L'ID du thème doit être passé dans l'URL
  const [themeData, setThemeData] = useState<ThemeDTO | null>(null);
  const [themeName, setThemeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      // Charger le thème avec cet ID
      fetchTheme(Number(id))
        .then((data: ThemeDTO) => {
          setThemeData(data);
          setThemeName(data.theme);
        })
        .catch((err) => {
          console.error("Erreur de chargement du thème", err);
          setError("Erreur lors du chargement du thème");
        });
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!themeName) {
      setError("Veuillez entrer un nom de thème");
      return;
    }
    setLoading(true);
    try {
      await updateTheme(Number(id), { theme: themeName });
      router.back();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du thème", err);
      setError("Erreur lors de la mise à jour du thème");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer le thème",
      "Êtes-vous sûr de vouloir supprimer ce thème ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTheme(Number(id));
              router.back();
            } catch (err) {
              console.error("Erreur lors de la suppression du thème", err);
              setError("Erreur lors de la suppression du thème");
            }
          },
        },
      ]
    );
  };

  if (!themeData) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Modifier le thème" />
        <Card.Content>
          <TextInput
            label="Nom du thème"
            value={themeName}
            onChangeText={setThemeName}
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
          <Button mode="outlined" onPress={handleDelete} color="red">
            Supprimer
          </Button>
          <Button mode="text" onPress={() => router.back()}>
            Annuler
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: { padding: 16 },
  input: { marginBottom: 12 },
  error: { color: "red", marginBottom: 8 },
});
