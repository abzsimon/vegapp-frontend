import "react-native-gesture-handler";
import "react-native-reanimated"; 

import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Screens
import HomeScreen from "./screens/HomeScreen";
import PlacesScreen from "./screens/PlacesScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import SearchScreen from "./screens/SearchScreen";
import NewsScreen from "./screens/NewsScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import ProposedRecipesScreen from "./screens/ProposedRecipesScreen";

// Création des navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ✅ Drawer Navigator : Contient le TabNavigator et d'autres écrans
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Proposed Recipes" component={ProposedRecipesScreen} />
    </Drawer.Navigator>
  );
}

// ✅ Bottom Tab Navigator (onglets en bas)
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

// ✅ Navigation principale
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* 🔹 L'utilisateur voit d'abord l'écran de connexion */}
          <Stack.Screen name="Sign-in-up" component={HomeScreen} />
          {/* 🔹 Une fois connecté, il accède au Drawer Navigator */}
          <Stack.Screen name="Sign-in-up" component={HomeScreen} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
