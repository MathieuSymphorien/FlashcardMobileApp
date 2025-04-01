// app/(screens)/Statistics.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { updateStreak, getAuthToken, login } from "@/services/api";

interface StreakUpdateResponseDTO {
  currentStreak: number;
  maxStreak: number;
  jokersLeft: number;
}

export default function Statistics() {
  const router = useRouter();
  const [stats, setStats] = useState<StreakUpdateResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!getAuthToken()) {
          await login("admin", "pGd'tb$EXh,]j]M'=&9Tuk/FqG?Y7ZB%4zo}ZZ67v?L");
        }
        const response = await updateStreak(1);
        setStats(response);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text>Impossible de charger les statistiques.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Statistiques" />
        <Card.Content>
          <Text>Streak actuel : {stats.currentStreak} jours</Text>
          <Text>Max Streak : {stats.maxStreak} jours</Text>
          <Text>Jokers restants : {stats.jokersLeft}</Text>
          {/* Vous pouvez ajouter d'autres statistiques ici */}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  card: { marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
