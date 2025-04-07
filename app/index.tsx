// app/MainSwiper.tsx
import React, { useRef, useState } from "react";
import {
  ScrollView,
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import ThemeList from "./screens/ThemeList";
import WordList from "./screens/WordList";
import FlashcardGame from "./screens/FlashcardGame";
import Statistics from "./screens/Statistics";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Index() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleMomentumScrollEnd = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  const navigateToPage = (page: number) => {
    scrollViewRef.current?.scrollTo({ x: page * width, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleMomentumScrollEnd}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={[styles.page, { width }]}>
          <ThemeList />
        </View>
        <View style={[styles.page, { width }]}>
          <WordList />
        </View>
        <View style={[styles.page, { width }]}>
          <FlashcardGame />
        </View>
        <View style={[styles.page, { width }]}>
          <Statistics />
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigateToPage(0)}
          style={styles.navItem}
        >
          <Ionicons
            name="color-palette"
            size={24}
            color={currentPage === 0 ? "#FFA500" : "#888"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigateToPage(1)}
          style={styles.navItem}
        >
          <Ionicons
            name="list"
            size={24}
            color={currentPage === 1 ? "#FFA500" : "#888"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigateToPage(2)}
          style={styles.navItem}
        >
          <Ionicons
            name="game-controller"
            size={24}
            color={currentPage === 2 ? "#FFA500" : "#888"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigateToPage(3)}
          style={styles.navItem}
        >
          <Ionicons
            name="stats-chart"
            size={24}
            color={currentPage === 3 ? "#FFA500" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  page: { flex: 1 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
});
