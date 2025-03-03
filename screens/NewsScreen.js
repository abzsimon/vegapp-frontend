import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

export default function Articles() {
  const [articlesData, setArticlesData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}articles`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched articles:", data.articles);
        setArticlesData(data.articles); // Fetch all articles
      })
      .catch((error) => console.error("Erreur lors du fetch :", error));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {articlesData.map((article, i) => (
          <TouchableOpacity key={i} onPress={() => console.log("Article sélectionné :", article.title)} style={styles.article}>
            <Text style={styles.title}>{article.title || "Titre inconnu"}</Text>
            <Text style={styles.author}>- {article.author ?? "Auteur inconnu"}</Text>
            <View style={styles.divider} />
            {article.urlToImage ? (
              <Image source={{ uri: article.urlToImage }} style={styles.image} resizeMode="cover" />
            ) : (
              <Text style={styles.noImage}>📷 Pas d'image disponible</Text>
            )}
            <Text style={styles.description}>{article.description ? article.description.slice(0, 100) + "..." : "Pas de description disponible."}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
  },
  article: {
    width: "48%", // Ensures 2 articles per row with spacing
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  noImage: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
});
