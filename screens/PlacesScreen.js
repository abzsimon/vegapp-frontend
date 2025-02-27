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
import { FontAwesome } from "@expo/vector-icons";

export default function PlacesScreen() {
  const [location, setLocation] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoBubble, setInfoBubble] = useState(null);
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.token);
  const userFavShops = useSelector((state) => state.user.favshops);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  useEffect(() => {
    if (infoBubble && userFavShops) {
      // Vérifier si le commerce est dans la liste des favoris
      const isFavorite = userFavShops.some(
        (shop) => shop.siret === infoBubble.siret
      );
      setIsBookmarked(isFavorite);
    }
  }, [infoBubble, userFavShops]);

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

  useEffect(() => {
    if (markers && userFavShops) {
      setIsBookmarked(userFavShops.includes(markers.siret));
    }
  }, [markers, userFavShops]);

  const toggleBookmark = async () => {
    if (!infoBubble || !userToken) return;

    try {
      const endpoint = "http://192.168.1.12:3000/users/business/bookmark";
      const method = isBookmarked ? "DELETE" : "POST";

      const requestBody = isBookmarked
        ? { token: userToken, siret: infoBubble.siret }
        : { token: userToken, business: infoBubble };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.result) {
        setIsBookmarked(!isBookmarked);

        // Mettre à jour le reducer
        if (isBookmarked) {
          // Si on retire des favoris
          const updatedFavShops = userFavShops.filter(
            (shop) => shop.siret !== infoBubble.siret
          );
          dispatch(updateFavShops(updatedFavShops));
        } else {
          // Si on ajoute aux favoris
          dispatch(updateFavShops([...userFavShops, infoBubble]));
        }
      }
    } catch (err) {
      console.error("Erreur lors de la modification des favoris:", err);
    }
  };
//test
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h2}>Trouvez un commerce</Text>
      <SearchContainer
        style={styles.searchContainer}
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
          style={styles.searchButton}
          onPress={async () => {
            const fetchedMarkers = await getBuisnessesWhoSellTheProducts(
              SavedIngredients
            );
            setMarkers(fetchedMarkers);
          }}
        >
          <Text style={styles.searchButtonText}>Lancer la recherche</Text>
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
        <Text>Chargement de la carte...</Text>
      )}
      {infoBubble && (
        <SafeAreaView style={styles.popup}>
          <View style={styles.popupHeader}>
            <Text style={styles.popuph1}>{infoBubble.name}</Text>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={toggleBookmark}
            >
              <FontAwesome
                name={isBookmarked ? "bookmark" : "bookmark-o"}
                size={24}
                color="#F28DEB"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInfoBubble(null)}
            >
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {infoBubble.categories && infoBubble.categories.length > 0 && (
            <View style={styles.tagContainer}>
              {infoBubble.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.addressText}>
            {infoBubble.adress}, {infoBubble.cp} {infoBubble.ville}
          </Text>

          {infoBubble.tel && (
            <Text style={styles.telText}>Tél: {infoBubble.tel}</Text>
          )}

          {infoBubble.sites && infoBubble.sites.length > 0 && (
            <View style={styles.sitesContainer}>
              {infoBubble.sites.map((site, index) => (
                <View key={index} style={styles.siteTag}>
                  <Text style={styles.siteText}>
                    {site.length > 25 ? site.substring(0, 25) + "..." : site}
                  </Text>
                </View>
              ))}
            </View>
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
    fontSize: 18,
    margin: 2,
    fontWeight: "bold",
    marginBottom: 8,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.75,
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
    borderColor: "#F28DEB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  IngredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    margin: 0,
    justifyContent: "center",
  },

  searchButton: {
    backgroundColor: "#F28DEB",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
    marginTop: 5,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  popup: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    paddingTop: 0,
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    borderColor: "#F28DEB",
    borderWidth: 2,
    position: "absolute",
    zIndex: 1,
    width: Dimensions.get("window").width * 0.8,
    height: "auto",
    maxHeight: Dimensions.get("window").height * 0.7,
    bottom: 30,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  popuph1: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  bookmarkButton: {
    padding: 5,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: "#E0F7FA",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 2,
  },
  categoryText: {
    fontSize: 12,
    color: "#00796B",
  },
  addressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  telText: {
    fontSize: 14,
    marginBottom: 5,
  },
  sitesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  siteTag: {
    backgroundColor: "#F3E5F5",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 2,
  },
  siteText: {
    fontSize: 12,
    color: "#7B1FA2",
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});
