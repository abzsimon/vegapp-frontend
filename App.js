import "react-native-gesture-handler";
import "react-native-reanimated";

import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Switch } from "react-native";
import { useEffect, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);
import Diet from "./components/diets";

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

// création des navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

console.log();

function CustomDrawerContent(props) {
  const userInfo = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(userInfo)
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        icon = {({ focused, color, size }) => <FontAwesome name="user-circle-o" size={size} color={color} />}
        label={() => (
          <SafeAreaView>
            <Text style={{fontSize : 20, marginBottom : 10}}>Bonjour, {userInfo.username.slice(0,1).toUpperCase()}{userInfo.username.slice(1)} !</Text>
            <Text style={{fontSize : 15, marginBottom : 8, textAlign : "center"}}>Vos préférences</Text>
            <Diet style={{ flexDirection : "column", alignItems : "center" }}/>
          </SafeAreaView>
        )}
        onPress={() => console.log("Drawer item pressed")}
      />
      <DrawerItem label="Déconnexion" onPress={()=> {
        dispatch(logoutUser())
        props.navigation.replace("Sign-in-up")
      }}></DrawerItem>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// création du drawer navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Proposed Recipes" component={ProposedRecipesScreen} />
      <Drawer.Screen name="A propos de la Vegapp" component={AboutScreen} />
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
          title: 'Détails de la recette',
          headerTintColor: '#F28DEB',
        }}
      />
      <Stack.Screen 
        name="AddRecipeSteps" 
        component={AddRecipeSteps}
        options={{
          headerShown: true,
          title: 'Ajout des étapes',
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
              <Stack.Screen name="Sign-in-up" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}
