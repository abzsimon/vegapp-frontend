import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const userToken = useSelector((state) => state.user.token);
  const userFavRecipes = useSelector((state) => state.user.favrecipes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (recipe && userFavRecipes) {
      setIsBookmarked(userFavRecipes.includes(recipe._id));
    }
  }, [recipe, userFavRecipes]);

  const toggleBookmark = async () => {
    try {
      const endpoint = `${process.env.EXPO_PUBLIC_API_URL}users/bookmark`;
      const method = isBookmarked ? "DELETE" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userToken,
          recipeId: recipe._id,
        }),
      });

      const data = await response.json();
      console.log(data)
      if (data.result) {
        setIsBookmarked(!isBookmarked);
        // Vous pourriez également mettre à jour le reducer user ici
      }
    } catch (err) {
      console.error("Erreur lors de la modification des favoris:", err);
    }
  };

  // Récupération des détails de la recette
  useEffect(() => {
    fetchRecipeDetails();
  }, [recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}recipes/${recipeId}`
      );
      const data = await response.json();

      if (data.result) {
        setRecipe(data.recipe);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors du chargement de la recette");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour le rendu des étoiles
  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => isInteractive && setSelectedRating(index + 1)}
        disabled={!isInteractive}
      >
        <FontAwesome
          name={index < rating ? "star" : "star-o"}
          size={isInteractive ? 24 : 16}
          color="#F28DEB"
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  // Fonction pour soumettre une note
  const submitRating = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}recipes/${recipeId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note: selectedRating }),
        }
      );
      const data = await response.json();
      if (data.result) {
        // Mettre à jour les détails de la recette suite au vote
        fetchRecipeDetails();
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (isLoading) return <Text>Chargement...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!recipe) return <Text>Recette non trouvée</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={toggleBookmark}
          >
            <FontAwesome
              name={isBookmarked ? "bookmark" : "bookmark-o"}
              size={35}
              color="#F28DEB"
            />
          </TouchableOpacity>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.ratingContainer}>
            {renderStars(recipe.averageNote)}
          </View>
        </View>

        {/* Régimes et catégories */}
        <View style={styles.tagsContainer}>
          {recipe.regime.map((regime, index) => (
            <View key={index} style={styles.tagPill}>
              <Text style={styles.tagText}>{regime}</Text>
            </View>
          ))}
        </View>

        {/* Informations générales */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Coût</Text>
            <Text style={styles.infoValue}>env. {recipe.cost}€</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Durée</Text>
            <Text style={styles.infoValue}>env. {recipe.duration}mn</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Difficulté</Text>
            <Text style={styles.infoValue}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Liste des ingrédients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingrédients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientQuantity}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* Étapes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step by step</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Section avis */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Laisser un avis</Text>
          <View style={styles.ratingStars}>
            {renderStars(selectedRating, true)}
          </View>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitRating}
            disabled={selectedRating === 0}
          >
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    paddingBottom: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
    paddingTop: 1,
    paddingBottom: 7,
    gap: 10,
  },
  tagPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F28DEB",
  },
  tagText: {
    color: "#F28DEB",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 15,
    borderRadius: 10,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  stepNumber: {
    width: 25,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
  },
  ratingSection: {
    padding: 15,
    alignItems: "center",
  },
  ratingStars: {
    flexDirection: "row",
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 2,
  },
  submitButton: {
    backgroundColor: "#F28DEB",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },

  bookmarkButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 10,
  },
});
