import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* Onglet 1 : liste groupée par catégories */}
      <Tabs.Screen name="word-list" options={{ title: "Liste de mots" }} />
      {/* Onglet 2 : flashcards */}
      <Tabs.Screen name="flashcards" options={{ title: "Flashcards" }} />
    </Tabs>
  );
}
