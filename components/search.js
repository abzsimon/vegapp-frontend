import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Diet from '../components/diets';

// Les constantes pour la réutilisabilité des données
const CATEGORIES = [
  ["Entrées", "Plats", "Desserts"],
  ["Fêtes", "Fast-food", "Healthy"],
  ["Afrique", "Asie", "Latino"],
];

export default function SearchScreen() {
  const navigation = useNavigation();
  const userDiets = useSelector((state) => state.user.regime); // Récupère les régimes depuis Redux
  // États pour gérer les filtres sélectionnés
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]); // Liste des recettes trouvées
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  

  // Fonction pour transformer les catégories frontend en catégories backend
  const transformCategory = (category) => {
    const categoryMap = {
      Entrées: "STARTER",
      Plats: "MAIN",
      Desserts: "DESSERT",
      Fêtes: "PARTY",
      "Fast-food": "FAST FOOD",
      Healthy: "HEALTHY",
      Afrique: "AFRICA",
      Asie: "ASIA",
      Latino: "LATINO",
    };
    return categoryMap[category];
  };

  // Fonction pour chercher les recettes
  const searchRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Construction de l'URL avec les paramètres de recherche
      let searchParams = new URLSearchParams();

      // Ajout du texte de recherche s'il existe
      if (searchText) {
        searchParams.append("keyword", searchText);
      }

      // Ajout des régimes sélectionnés
      userDiets.forEach((regime) => {
        searchParams.append("regime", regime);
      });

      // Ajout des catégories sélectionnées (transformées)
      selectedCategories.forEach((category) => {
        const backendCategory = transformCategory(category);
        if (backendCategory) {
          searchParams.append("category", backendCategory);
        }
      });

      // Faire la requête au backend
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}${searchParams}`,
      );
      const data = await response.json();

      if (data.result) {
        // Transformer les données pour correspondre à notre format d'affichage
        const transformedRecipes = data.recipes.map((recipe) => ({
          id: recipe._id,
          title: recipe.title,
          description: recipe.description,
          rating: recipe.averageNote, // Pour l'affichage des étoiles
          difficulty: recipe.difficulty,
          duration: recipe.duration,
          cost: recipe.cost,
        }));

        setRecipes(transformedRecipes);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de la recherche des recettes");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour la recherche quand les filtres changent
  useEffect(() => {
    if (userDiets.length > 0 || selectedCategories.length > 0) {
      searchRecipes();
    }
  }, [userDiets, selectedCategories]);

  // Fonction pour gérer la sélection des catégories
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((r) => r !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Rendu des étoiles pour la note
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? "star" : "star-o"}
          size={12}
          color="#F28DEB"
        />
      );
    }
    return stars;
  };

  // Fonction pour afficher une recette
  const RecipeCard = ({ recipe }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(recipe.rating)}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.seeButton}
        onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
      >
        <Text style={styles.seeButtonText}>Voir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Trouvez une recette !</Text>

        {/* Filtres de régime alimentaire */}
        <Diet onRegimeChange={() => searchRecipes()} />
        <Text style={styles.sectionTitle}>Catégories</Text>

        {/* Grille de catégories */}
        {CATEGORIES.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.categoryRow}>
            {row.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="J'ai envie de..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              isLoading && styles.searchButtonDisabled,
            ]}
            onPress={searchRecipes}
            disabled={isLoading}
          >
            <Text style={styles.searchButtonText}>
              {isLoading ? "Recherche..." : "Rechercher"}
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Liste des recettes */}
        <View style={styles.recipesContainer}>
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  regimeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },
  regimeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F28DEB",
    backgroundColor: "#FFFFFF",
  },
  regimeButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
  },
  regimeText: {
    color: "#F28DEB",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  categoryButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F28DEB",
  },

  categoryText: {
    color: "#F28DEB",
  },
  searchContainer: {
    marginVertical: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#F28DEB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  recipeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  seeButton: {
    backgroundColor: "#F28DEB",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  seeButtonText: {
    color: "#fff",
  },

  searchButtonDisabled: {
    opacity: 0.7
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10
  }
});
