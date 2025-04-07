// app/_layout.tsx
import { Stack } from "expo-router";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { useFonts } from "expo-font";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2A2A2A", // gris foncé
    accent: "#FFA500", // accent orange
    background: "#FFFFFF", // fond blanc
    surface: "#F5F5F5", // surface très claire
    text: "#333333", // texte sombre
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Charger vos polices personnalisées ici si nécessaire
  });

  if (!fontsLoaded) {
    return null; // ou afficher un splash screen
  }

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
