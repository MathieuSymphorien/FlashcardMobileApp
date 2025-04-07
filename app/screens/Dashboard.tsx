// app/(screens)/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { updateStreak, getAuthToken, login } from "@/services/api";

interface StreakUpdateResponseDTO {
  currentStreak: number;
  maxStreak: number;
  jokersLeft: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<StreakUpdateResponseDTO | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      try {
        if (!getAuthToken()) {
          await login("root", "root");
        }
        const response = await updateStreak(1); // ID utilisateur
        setUserStats(response);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
        alert(
          "Erreur lors du chargement des statistiques. Veuillez vérifier votre connexion."
        );
      }
    }
    fetchData();
  }, []);

  if (!userStats) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Chargement des statistiques...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Dashboard" />
        <Card.Content>
          <Text>Streak actuel : {userStats.currentStreak} jours</Text>
          <Text>Max Streak : {userStats.maxStreak} jours</Text>
          <Text>Jokers restants : {userStats.jokersLeft}</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => router.push("/screens/FlashcardGame")}
      >
        Commencer session
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push("/screens/WordList")}
        style={{ marginTop: 8 }}
      >
        Gérer les mots
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push("/screens/CreateTheme")}
        style={{ marginTop: 8 }}
      >
        Créer un thème
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push("/screens/Statistics")}
        style={{ marginTop: 8 }}
      >
        Statistiques
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: { marginBottom: 16 },
});
