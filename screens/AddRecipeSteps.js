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
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddRecipeSteps() {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipeData } = route.params;

  const [steps, setSteps] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ajouter une nouvelle étape
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // Mettre à jour une étape
  const updateStep = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  // Supprimer une étape
  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

// Validation des données avant soumission
const validateRecipe = () => {
  if (steps.length === 0) {
    setError("Ajoutez au moins une étape");
    return false;
  }

  if (steps.some((step) => step.trim() === "")) {
    setError("Toutes les étapes doivent être remplies");
    return false;
  }

  return true;
};

const transformCategory = (category) => {
  const categoryMap = {
    'Entrées': 'STARTER',
    'Plats': 'MAIN',
    'Desserts': 'DESSERT',
    'Fêtes': 'PARTY',
    'Fast-food': 'FAST FOOD',
    'Healthy': 'HEALTHY',
    'Afrique': 'AFRICA',
    'Asie': 'ASIA',
    'Latino': 'LATINO'
  };
  return categoryMap[category];
};

const transformDifficulty = (difficulty) => {
  const difficultyMap = {
    'Facile': 'EASY',
    'Moyen': 'MEDIUM',
    'Difficile': 'HARD'
  };
  return difficultyMap[difficulty] || 'MEDIUM';
};
  // Soumettre la recette complète
  const submitRecipe = async () => {
    try {
      if (!validateRecipe()) {
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      const finalRecipeData = {
        title: recipeData.title,
        description: recipeData.description || recipeData.title,
        regime: recipeData.regime || [],
        ingredients: recipeData.ingredients,
        category: transformCategory(recipeData.selectedCategories[0]),
        difficulty: transformDifficulty(recipeData.difficulty),
        cost: parseFloat(recipeData.cost) || 0,
        duration: parseInt(recipeData.duration) || 0,
        steps: steps.filter(step => step.trim() !== '')
      };
  
      console.log('Sending recipe data:', finalRecipeData); // Debug log
  
      // const response = await fetch("http://192.168.1.12:3000/recipes", {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}recipes`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalRecipeData)
      });
  
      const data = await response.json();
      console.log('Server response:', data); // Debug log
  
      if (data.result) {
        // Navigate and replace the current screen to prevent going back
        navigation.reset({
          index: 0,
          routes: [{ name: 'Search' }],
        });
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError("Erreur lors de la création de la recette");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Ajouter une recette</Text>
        <Text style={styles.subtitle}>
          Décrivez étape par étape,{"\n"}comment réaliser votre recette
        </Text>

        {/* Liste des étapes */}
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <Text style={styles.stepNumber}>Étape {index + 1}</Text>
            <TextInput
              style={styles.stepInput}
              value={step}
              onChangeText={(text) => updateStep(text, index)}
              multiline
              placeholder={`Décrivez l'étape ${index + 1}...`}
            />
            {steps.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeStep(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Bouton pour ajouter une étape */}
        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Text style={styles.addButtonText}>+ Ajouter une étape</Text>
        </TouchableOpacity>

        {/* Bouton de soumission */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={submitRecipe}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? "Envoi..." : "Soumettre la recette"}
          </Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  stepContainer: {
    marginBottom: 15,
    position: "relative", 
    marginLeft: 15,
    marginRight: 15,

  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#F28DEB",
  },
  stepInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    paddingRight: 40, 
  },
  removeButton: {
    position: "absolute",
    right: 10,
    top: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ffebf5",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeButtonText: {
    color: "#F28DEB",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "#F28DEB",
    borderStyle: "dashed",
    marginLeft: 15,
    marginRight: 15,
  },
  addButtonText: {
    color: "#F28DEB",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#F28DEB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

