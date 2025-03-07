import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const navigation = useNavigation();
  const userToken = useSelector((state) => state.user.token);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les recettes favorites au chargement de l'écran
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Ajouter un focus listener pour rafraîchir les favoris quand on revient sur cette page
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}users/bookmarks/${userToken}`);
      const data = await response.json();

      if (data.result) {
        setBookmarks(data.bookmarks);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement des favoris');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour retirer un favori
  const removeBookmark = async (recipeId) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}users/bookmark`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: userToken,
          recipeId: recipeId,
        }),
      });
      
      const data = await response.json();
      
      if (data.result) {
        // Mise à jour locale des favoris sans avoir à refaire une requête
        setBookmarks(bookmarks.filter(bookmark => bookmark._id !== recipeId));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du favori:', err);
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

  // Rendu d'un élément de la liste des favoris
  const renderBookmarkItem = ({ item }) => (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkInfo}>
        <Text style={styles.bookmarkTitle}>{item.title}</Text>
        <Text style={styles.bookmarkDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.ratingContainer}>
          {renderStars(item.averageNote)}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('RecipeDetail', { recipeId: item._id })}
        >
          <Text style={styles.buttonText}>Voir</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeBookmark(item._id)}
        >
          <FontAwesome name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F28DEB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mes recettes favorites</Text>
      
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bookmark-o" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Vous n'avez pas encore de recettes favorites</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.buttonText}>Découvrir des recettes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookmarkCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  bookmarkDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#F28DEB',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontSize: 16,
  },
  browseButton: {
    backgroundColor: '#F28DEB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});