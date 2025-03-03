import "react-native-reanimated";
import "react-native-gesture-handler";

import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Switch, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";

// Redux
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const reducers = combineReducers({ user });
const persistConfig = { key: "Vegapp", storage: AsyncStorage };
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user, { logoutUser } from "./reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { addDiet, removeDiet } from "./reducers/user";
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

// Screens
import HomeScreen from "./screens/HomeScreen";
import PlacesScreen from "./screens/PlacesScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import SearchScreen from "./screens/SearchScreen";
import NewsScreen from "./screens/NewsScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import ProposedRecipesScreen from "./screens/ProposedRecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import AddRecipeSteps from "./screens/AddRecipeSteps";
import AboutScreen from "./screens/AboutScreen";

// création des navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

console.log();

function CustomDrawerContent(props) {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const changeDietDb = (regime, method) => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}users/regimes`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: userInfo.token, 
        regime: regime, // Replace with the regime you want to add
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('Regime toggled successfully!');
        } else {
          setMessage(data.error); // Display error message
        }
      })
      .catch(error => {
        console.error('Error adding regime:', error);
        setMessage('An error occurred.');
      });
  };

  const toggleDiet = (diet) => {
    if (userInfo.regime.includes(diet)) {
      changeDietDb(diet, "DELETE")
      dispatch(removeDiet(diet)); // supprime si ∃
    } else {
      dispatch(addDiet(diet)); // ajoute si ∄
      changeDietDb(diet, "POST")
    }
  };
  console.log(userInfo);

  return (
    <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
      <DrawerItem
        label={() => (
          <SafeAreaView>
            <Text style={{ fontSize: 20, marginBottom: 20, textAlign : "center  " }}>
              Bonjour {userInfo.username.slice(0, 1).toUpperCase()}
              {userInfo.username.slice(1)} !
            </Text>
            <SafeAreaView style={styles.userPrefs}>
              <FontAwesome size={25} name="user-circle-o" />
              <SafeAreaView style={styles.toggleLines}>
                {/* on vient mapper sur un tableau de trois strings contenant les types de régime pour générer trois couples switch/texte qui active/desactive le régime dans le reducer & dans la DB en utilisant la fonction toggleDiet*/}
                {["vegan", "veggie", "gluten"].map((diet) => (
                  <SafeAreaView key={diet} style={styles.btn}>
                    <Text>{diet.charAt(0).toUpperCase() + diet.slice(1)}</Text>
                    <Switch
                      style={styles.toggle}
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={
                        userInfo.regime.includes(diet) ? "#f5dd4b" : "#f4f3f4"
                      }
                      onValueChange={() => toggleDiet(diet)} // on toggle la valeur (on/off) dans le reducer pour tel régime
                      value={userInfo.regime.includes(diet)} // on récupère la valeur (booléenne) depuis redux, on/off pour tel régime
                    />
                  </SafeAreaView>
                ))}
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        )}
        onPress={() => console.log("Drawer item pressed")}
      />
      <DrawerItem
        icon={({ focused, color, size }) => (
          <FontAwesome color={color} size={20} name="power-off" />
        )}
        label="Déconnexion"
        onPress={() => {
          dispatch(logoutUser());
          props.navigation.replace("Sign-in-up");
        }}
      />
    </DrawerContentScrollView>
  );
}

// création du drawer navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Vegapp"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome color={color} size={20} name="leaf" />
          ),
        }}
      />
      <Drawer.Screen
        name="Recettes proposées"
        component={ProposedRecipesScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome6 color={color} size={20} name="bowl-rice" />
          ),
        }}
      />
      <Drawer.Screen
        name="A propos"
        component={AboutScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome6 color={color} size={20} name="question-circle" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// création de la vue par onglets
const TabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabScreens">
        {() => (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName = "";

                if (route.name === "Places") {
                  iconName = "map-marker";
                } else if (route.name === "Bookmarks") {
                  iconName = "bookmark";
                } else if (route.name === "AddRecipe") {
                  iconName = "plus-circle";
                } else if (route.name === "News") {
                  iconName = "newspaper-o";
                } else if (route.name === "Search") {
                  iconName = "search";
                }

                return (
                  <FontAwesome name={iconName} size={size} color={color} />
                );
              },
              tabBarActiveTintColor: "#049DD9",
              tabBarInactiveTintColor: "#335561",
              headerShown: false,
            })}
          >
            <Tab.Screen name="Places" component={PlacesScreen} />
            <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
            <Tab.Screen name="AddRecipe" component={AddRecipeScreen} />
            <Tab.Screen name="News" component={NewsScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{
          headerShown: true,
          title: "Détails de la recette",
          headerTintColor: "#F28DEB",
        }}
      />
      <Stack.Screen
        name="AddRecipeSteps"
        component={AddRecipeSteps}
        options={{
          headerShown: true,
          title: "Ajout des étapes",
          headerTintColor: "#F28DEB",
        }}
      />
    </Stack.Navigator>
  );
};

// REDUX
persistor.purge().then();
AsyncStorage.clear().then();

// APP
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
              />
              <Stack.Screen name="Sign-in-up" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  userPrefs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    border: "solid",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    width: 240,
    marginBottom : 300,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 150,
    marginVertical: -5,
  },
});
