import "react-native-gesture-handler";
import "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Redux
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user"
const store = configureStore({
  reducer: { user },
});

// Screens
import HomeScreen from "./screens/HomeScreen";
import PlacesScreen from "./screens/PlacesScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import SearchScreen from "./screens/SearchScreen";
import NewsScreen from "./screens/NewsScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import ProposedRecipesScreen from "./screens/ProposedRecipesScreen";

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
  );
};

// REDUX

// APP
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Après avoir passé le HomeScreen, on arrive sur le Drawer Navigator, qui contient Tab Navigator \(name=home component=TabNavigator\), qui contient Places, Bookmarks, AddRecipe, News, Search. Pour le moment j'inverse l'un et l'autre pour travailler en attendant que la logique de sign-in/up soit gérée */}
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="Sign-in-up" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
}
