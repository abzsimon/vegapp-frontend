import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../components/header";
import SearchContainer from "../components/searchContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { addIngredient, removeIngredient } from "../reducers/user";

export default function PlacesScreen() {
  const [location, setLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();

  // pour obtenir la position de l'utilisateur.ice
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  // pour récupérer la liste d'ingrédients et leur code CPF sauvés dans le reducer
  let SavedIngredients = useSelector((state) => state.user.ingredients);

  // pour gérer la recherche d'ingrédients, va requêter la collection ingredientsCpf qui contient les 670+ ingrédients et leur code de l'API agencebio
  const handleInputChange = async (inputValue) => {
    console.log(inputValue);
    const response = await fetch(
      `http://192.168.206.57:3000/commerces/ingredientsCpf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: inputValue }),
      }
    );
    const data = await response.json();
    console.log("résultat de la query sur la collection ingredientsCpf",data);
    return data.ingredients.map((e) => ({ ...e, _searchName: e.title }));
  };

  // pour sélectionner un ingrédient de la base de données retourné par la barre de recherche, pour le renvoyer à l'API agencebio
  const handleSelection = (result) => {
    console.log("tu as dispatch l'ingrédient suivant",result);
    dispatch(addIngredient({ id: result.id, title: result._searchName }));
  };

  // pour supprimer un ingrédient et ne pas l'envoyer à l'API
  const deleteIngredient = (ingredient) => {
    dispatch(removeIngredient(ingredient));
  };

  console.log("voici le contenu du reducer", SavedIngredients)

  const getBuisnessesWhoSellTheProducts = async (ingredients) => {
    const response = await fetch(
      `https://opendata.agencebio.org/api/gouv/operateurs/?lat=${location.coords.latitude}&lng=${location.coords.longitude}&filtrerVenteDetailinteger=1&filtrerRestaurantsinteger=1&filtrerGrandeSurfaceinteger=1&filtrerCommercantsEtArtisansinteger=1&codesProduits=${ingredients}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: inputValue }),
      }
    );
    const data = await response.json();
    console.log("résultat de la query sur la collection ingredientsCpf",data);
    return data.ingredients.map((e) => ({ ...e, _searchName: e.title }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>Vegapp</Text>
      <Text style={styles.h2}>Trouvez un commerce</Text>
      <SearchContainer
        onInputChange={handleInputChange}
        onResultSelection={handleSelection}
        minChar={3}
        placeholder={"De quel ingrédient avez-vous besoin?"}
      />
      <SafeAreaView style={styles.IngredientsContainer}>
        {SavedIngredients.length > 0 ? (
          SavedIngredients.map((e, index) => (
            <TouchableOpacity
              style={styles.SavedIngredient}
              key={index}
              onPress={() => {
                deleteIngredient(e);
              }}
            >
              <Text>{e.title}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Aucun ingrédient sélectionné...</Text>
        )}
      </SafeAreaView>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        ></MapView>
      ) : (
        <Text>Fetching coordinates...</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    fontSize: 50,
  },
  h2: {
    fontSize: 20,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    marginVertical: 10,
  },
  dropdown: {
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
  },
  SavedIngredient: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "darksalmon",
    borderRadius: 200,
    padding: 5,
    margin: 5,
  },
  IngredientsContainer: {
    flexDirection: "row",
  },
});
