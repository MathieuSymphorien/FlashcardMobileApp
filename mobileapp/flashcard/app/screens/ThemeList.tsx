import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Card, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { fetchThemes, deleteTheme } from "@/services/api";

interface ThemeDTO {
  id: number;
  theme: string;
}

export default function ThemeList() {
  const router = useRouter();
  const [themes, setThemes] = useState<ThemeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchThemes();
      setThemes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des thèmes : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const handleDelete = (id: number) => {
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
              await deleteTheme(id);
              loadThemes();
            } catch (error) {
              console.error("Erreur lors de la suppression du thème", error);
            }
          },
        },
      ]
    );
  };

  const renderTheme = ({ item }: { item: ThemeDTO }) => {
    return (
      <Card style={styles.card}>
        <Card.Title title={item.theme} />
        <Card.Actions>
          <Button
            onPress={() => router.push(`/screens/EditTheme?id=${item.id}`)}
          >
            Modifier
          </Button>
          <Button onPress={() => handleDelete(item.id)} textColor="red">
            Supprimer
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Chargement des thèmes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={themes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTheme}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>Aucun thème trouvé.</Text>
          </View>
        }
      />
      <Button
        mode="contained"
        onPress={() => router.push("/screens/CreateTheme")}
        style={styles.addButton}
      >
        Ajouter un thème
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  addButton: { marginTop: 16 },
});
