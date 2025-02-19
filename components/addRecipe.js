import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Diet from '../components/diets'; // Réutilisation du composant Diet

const CATEGORIES = [
  ['Entrées', 'Plats', 'Desserts'],
  ['Fêtes', 'Fast-food', 'Healthy'],
  ['Afrique', 'Asie', 'Latino'],
];

const DIFFICULTY_LEVELS = ['Facile', 'Moyen', 'Difficile'];

export default function AddRecipeScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [cost, setCost] = useState('');
  const [duration, setDuration] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      'Entrées': 'STARTER',
      'Plats': 'MAIN',
      'Desserts': 'DESSERT',
      'Fêtes': 'PARTY',
      'Fast-food': 'FAST FOOD',
      'Healthy': 'HEALTHY',
      'Afrique': 'AFRICA',
      'Asie': 'ASIA',
      'Latino': 'LATINO',
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
        ingredients: ingredients.split('\n').map(ingredient => ({
          name: ingredient.trim(),
          quantity: 0,
          unit: ''
        })),
        steps: steps
      };

      const response = await fetch('http://192.168.1.12:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();

      if (data.result) {
        navigation.navigate('Search'); // Redirection après succès
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erreur lors de la création de la recette');
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Proposer une recette</Text>

        {/* Composant Diet réutilisé */}
        <Diet />

        <Text style={styles.sectionTitle}>Catégories</Text>
        {/* Grille de catégories */}
        {CATEGORIES.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.categoryRow}>
            {row.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) && styles.categoryButtonSelected,
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
        <TextInput
          style={styles.ingredientsInput}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Ingrédients (un par ligne)"
          multiline
          numberOfLines={4}
        />

        {/* Bouton pour passer aux étapes */}
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('AddRecipeSteps', { 
            recipeData: {
              title,
              description,
              selectedCategories,
              difficulty,
              cost,
              duration,
              ingredients
            }
          })}
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
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F28DEB',
  },
  categoryText: {
    color: '#F28DEB',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F28DEB',
  },
  difficultyText: {
    color: '#F28DEB',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  ingredientsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#F28DEB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});