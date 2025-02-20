import { StyleSheet, Text, View, TouchableOpacity, Link } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapView, { Marker, Callout } from "react-native-maps";
import { Dimensions } from "react-native";
import * as Location from "expo-location";
import { useHeaderHeight } from "@react-navigation/elements";
import SearchContainer from "../components/searchContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { addIngredient, removeIngredient } from "../reducers/user";

export default function PlacesScreen() {
  const [location, setLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoBubble, setInfoBubble] = useState(null);
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
      `http://192.168.1.12:3000/commerces/ingredientsCpf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: inputValue }),
      }
    );
    const data = await response.json();
    console.log("résultat de la query sur la collection ingredientsCpf", data);
    return data.ingredients.map((e) => ({ ...e, _searchName: e.title }));
  };

  // pour sélectionner un ingrédient de la base de données retourné par la barre de recherche, pour le renvoyer à l'API agencebio
  const handleSelection = (result) => {
    console.log("tu as dispatch l'ingrédient suivant", result);
    dispatch(addIngredient({ id: result.id, title: result._searchName }));
  };

  // pour supprimer un ingrédient et ne pas l'envoyer à l'API
  const deleteIngredient = (ingredient) => {
    dispatch(removeIngredient(ingredient));
  };

  console.log("voici le contenu du reducer", SavedIngredients);

  const getBuisnessesWhoSellTheProducts = async (ingredients) => {
    let prodList = ingredients.map((e) => e.id).join(",");
    const url = `https://opendata.agencebio.org/api/gouv/operateurs/?codesProduits=${prodList}&lat=${location.coords.latitude}&lng=${location.coords.longitude}&nb=50`;
    console.log("📤 Requesting API:", url);
    try {
      const response = await fetch(url, { method: "GET" });
      console.log(`Status Code: ${response.status}`);
      if (!response.ok) {
        console.error("API returned an error:", response.status);
        return null;
      }
      console.log("📥 Response received, waiting for JSON parsing...");
      const data = await response.json();
      console.log(url);
      let shopList = [];
      data.items.forEach((shop) => {
        shop.adressesOperateurs.forEach((adress) => {
          let shopInfo = {
            name: shop.denominationcourante,
            tel: shop.telephoneNational,
            siret: shop.siret,
            categories:
              shop.categories.length > 0
                ? shop.categories.map((cat) => cat.nom)
                : [],
            sites:
              shop.siteWebs.length > 0
                ? shop.siteWebs.map((site) => site.url)
                : [],
            lat: Number(adress.lat),
            lng: Number(adress.long),
            adress: adress.lieu,
            cp: adress.codePostal,
            ville: adress.ville,
          };

          shopList.push(shopInfo);
        });
      });
      console.log(shopList.length, data.items.length);
      console.log(shopList);
      const markers = shopList.map((data, i) => {
        return (
          <Marker
            key={i}
            coordinate={{ latitude: data.lat, longitude: data.lng }}
            onPress={() => setInfoBubble(data)}
          ></Marker>
        );
      });
      return markers;
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };
  console.log(infoBubble);

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity
          style={styles.SavedIngredient}
          onPress={async () => {
            const fetchedMarkers = await getBuisnessesWhoSellTheProducts(
              SavedIngredients
            );
            setMarkers(fetchedMarkers);
          }}
        >
          <Text>Lancer la recherche</Text>
        </TouchableOpacity>
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
        >
          {markers}
        </MapView>
      ) : (
        <Text>Fetching coordinates...</Text>
      )}
      {infoBubble && (
        <SafeAreaView style={styles.popup}>
          <Text style={styles.popuph1}>
            {infoBubble.name}
          </Text>
          {infoBubble.categories && (
            <View style={styles.tagContainer}>
              {infoBubble.categories.map((category, index) => (
                <View key={index}>
                  <Text style={{fontStyle : "italic"}}>{category}</Text>
                </View>
              ))}
            </View>
          )}
          {infoBubble.sites && (
            <View style={styles.tagContainer}>
              {infoBubble.sites.map((site, index) => (
                <View key={index} style={styles.tagBubble}>
                  <Text style={styles.tagText}>{site.length > 25 ? site.substring(0, 25) + "..." : site}</Text>
                </View>
              ))}
            </View>
          )}
          {infoBubble.adress && (
            <Text style={{ fontSize: 14 }}>{infoBubble.adress}</Text>
          )}
          {infoBubble.cp && (
            <Text style={{ fontSize: 14 }}>{infoBubble.cp}</Text>
          )}
          {infoBubble.ville && (
            <Text style={{ fontSize: 14 }}>{infoBubble.ville}</Text>
          )}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  h2: {
    fontSize: 20,
    margin : 2,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.65,
  },
  dropdown: {
    width: Dimensions.get("window").width * 0.8,
    alignSelf: "center",
  },
  SavedIngredient: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F28DEB", // Mise à jour de la couleur pour matcher le thème
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  IngredientsContainer: {
    flexDirection: "row",
  },
  popup: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "rgba(134, 132, 129, 0.80)",
    padding: 10,
    borderRadius: 20,
    borderColor: "#6558F5",
    borderWidth: 2,
    position: "absolute",
    zIndex: 1,
    width: Dimensions.get("window").width * 0.8,
    top: Dimensions.get("window").height * 0.6,
  },
  popuph1: {
    fontSize : 14,
    fontWeight : 600,
  },
  tagContainer : {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  tagBubble : {
    border : "solid",
    borderColor : "black",
    borderWidth : 2,
    borderRadius : 20,
    margin : 2,
    paddingVertical : 2,
    paddingHorizontal : 10,

  }
});
