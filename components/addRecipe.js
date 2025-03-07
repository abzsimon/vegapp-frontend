import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const CATEGORIES = [
  ["Entrées", "Plats", "Desserts"],
  ["Fêtes", "Fast-food", "Healthy"],
  ["Afrique", "Asie", "Latino"],
];

const DIFFICULTY_LEVELS = ["Facile", "Moyen", "Difficile"];
const UNITS = ["g", "ml", "kg", "L", "càs", "càc", "pièce(s)"];
const REGIMES = ['Vegan', 'Végé', 'Sans gluten', 'Bio'];

export default function AddRecipeScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState({
    name: "",
    quantity: "",
    unit: "",
  });
  const [selectedRegimes, setSelectedRegimes] = useState([]);

  const addIngredient = () => {
    if (
      !currentIngredient.name ||
      !currentIngredient.quantity ||
      !currentIngredient.unit
    ) {
      setError("Veuillez remplir tous les champs de l'ingrédient");
      return;
    }
    setIngredients([
      ...ingredients,
      {
        ...currentIngredient,
        quantity: Number(currentIngredient.quantity),
        icon: "📝", // Émoji par défaut
      },
    ]);
    setCurrentIngredient({ name: "", quantity: "", unit: "" });
    setError(null);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Fonction pour gérer la sélection des catégories
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Fonction pour transformer les catégories en format backend
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

  // Soumettre la recette
  const submitRecipe = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const recipeData = {
        title,
        description,
        category: transformCategory(selectedCategories[0]), // On prend la première catégorie sélectionnée
        difficulty: difficulty.toUpperCase(),
        cost: parseFloat(cost),
        duration: parseInt(duration),
        ingredients: ingredients,
        steps: steps,
      };

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}recipes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipeData),
        }
      );

      const data = await response.json();

      if (data.result) {
        navigation.navigate("Search"); // Redirection après succès
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de la création de la recette");
      console.error("Submit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !title ||
      !description ||
      selectedCategories.length === 0 ||
      !difficulty ||
      !cost ||
      !duration ||
      ingredients.length === 0
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <Text style={styles.sectionTitle}>Régimes alimentaires</Text>
<View style={styles.regimeContainer}>
  {REGIMES.map((regime) => (
    <TouchableOpacity
      key={regime}
      style={[
        styles.regimeButton,
        selectedRegimes.includes(regime) && styles.regimeButtonSelected,
      ]}
      onPress={() => {
        if (selectedRegimes.includes(regime)) {
          setSelectedRegimes(selectedRegimes.filter(r => r !== regime));
        } else {
          setSelectedRegimes([...selectedRegimes, regime]);
        }
      }}
    >
      <Text style={styles.regimeText}>{regime}</Text>
    </TouchableOpacity>
  ))}
</View>
        <Text style={styles.sectionTitle}>Titre de la recette</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Titre de votre recette"
          numberOfLines={1}
        />
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="Description de votre recette"
          multiline
          numberOfLines={3}
        />
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

        {/* Difficulté */}
        <Text style={styles.sectionTitle}>Difficulté</Text>
        <View style={styles.difficultyContainer}>
          {DIFFICULTY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.difficultyButtonSelected,
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text style={styles.difficultyText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coût et Durée */}
        <View style={styles.rowContainer}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Coût estimé</Text>
            <TextInput
              style={styles.input}
              value={cost}
              onChangeText={setCost}
              placeholder="€"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Durée estimée</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="min"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Ingrédients */}
        <Text style={styles.sectionTitle}>Ingrédients</Text>
<View style={styles.ingredientInputContainer}>
  <View style={styles.ingredientRow}>
    {/* Input Quantité */}
    <TextInput
      style={styles.quantityInput}
      value={currentIngredient.quantity}
      onChangeText={(text) =>
        setCurrentIngredient({ ...currentIngredient, quantity: text })
      }
      placeholder="Qté"
      keyboardType="numeric"
    />
    
    {/* Input Nom de l'ingrédient */}
    <TextInput
      style={styles.ingredientNameInput}
      value={currentIngredient.name}
      onChangeText={(text) =>
        setCurrentIngredient({ ...currentIngredient, name: text })
      }
      placeholder="Ingrédient"
    />
  </View>
  
  {/* Unités en dessous */}
  <View style={styles.unitRow}>
    {UNITS.map((unit) => (
      <TouchableOpacity
        key={unit}
        style={[
          styles.unitButton,
          currentIngredient.unit === unit && styles.unitButtonSelected,
        ]}
        onPress={() => setCurrentIngredient({ ...currentIngredient, unit })}
      >
        <Text style={[
          styles.unitText,
          currentIngredient.unit === unit && styles.unitTextSelected,
        ]}>
          {unit}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
  
  {/* Bouton Ajouter */}
  <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
    <Text style={styles.addButtonText}>Ajouter</Text>
  </TouchableOpacity>
</View>

        {/* Liste des ingrédients ajoutés */}
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientListItem}>
            <Text style={styles.ingredientText}>
              {ingredient.quantity} {ingredient.unit} de {ingredient.name}
            </Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.removeButton}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Bouton pour passer aux étapes */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (validateForm()) {
              const recipeData = {
                title,
                description,
                selectedCategories,
                difficulty,
                cost,
                duration,
                ingredients,
                regime: selectedRegimes,
              };

              console.log("Navigating with recipeData:", recipeData); // Debugging

              navigation.navigate("AddRecipeSteps", { recipeData });
            }
          }}
        >
          <Text style={styles.nextButtonText}>Ajouter les étapes →</Text>
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginLeft: 20,
    marginRight: 20,
  },
  regimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  regimeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F28DEB',
    backgroundColor: '#FFFFFF',
  },
  regimeButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F28DEB',
  },
  regimeText: {
    color: '#F28DEB',
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
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 20,
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
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  difficultyButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F28DEB",
  },
  difficultyText: {
    color: "#F28DEB",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    marginBottom: 5,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  ingredientsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
  },
  nextButton: {
    backgroundColor: "#F28DEB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  ingredientInputContainer: {
    marginBottom: 100,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  quantityInput: {
    width: 70,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  unitContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  unitButtonSelected: {
    backgroundColor: '#F28DEB',
    borderColor: '#F28DEB',
  },
  
  unitText: {
    color: "#333",
  },

  unitTextSelected: {
    color: '#fff',
  },

  ingredientNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },

  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: "#F28DEB",
    width: "40%",
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  ingredientListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientText: {
    flex: 1,
  },
  removeButton: {
    color: "#F28DEB",
    fontSize: 24,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
