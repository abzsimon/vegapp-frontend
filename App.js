import "react-native-gesture-handler";
import "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Redux
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const reducers = combineReducers({ user });
const persistConfig = { key: "Vegapp", storage: AsyncStorage };
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./reducers/user";
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

// création des navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// création du drawer navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen
        name="Proposed Recipes"
        component={ProposedRecipesScreen}
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

                return <FontAwesome name={iconName} size={size} color={color} />;
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
          title: 'Détails de la recette',
          headerTintColor: '#F28DEB',
        }}
      />
    </Stack.Navigator>
  );
};

// REDUX
// persistor.purge().then()
// AsyncStorage.clear().then()

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
            <Stack.Screen 
            name="Sign-in-up" 
            component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}
