// app/(screens)/CreateTheme.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { createTheme } from "@/services/api";

export default function CreateTheme() {
  const router = useRouter();
  const [themeName, setThemeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onCreate = async () => {
    if (!themeName) {
      setError("Veuillez entrer un nom de thème");
      return;
    }
    setLoading(true);
    try {
      await createTheme({ theme: themeName });
      router.back();
    } catch (err) {
      console.error("Erreur lors de la création du thème", err);
      setError("Erreur lors de la création du thème");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Créer un nouveau thème" />
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
          <Button mode="contained" onPress={onCreate} disabled={loading}>
            {loading ? "Création..." : "Créer"}
          </Button>
          <Button mode="outlined" onPress={() => router.back()}>
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
