import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import PlacesScreen from './screens/PlacesScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import SearchScreen from './screens/SearchScreen';
import NewsScreen from './screens/NewsScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = '';

        if (route.name === 'Places') {
          iconName = 'map-marker';
        } else if (route.name === 'Bookmarks') {
          iconName = 'bookmark';
        } else if (route.name === 'AddRecipe') {
          iconName = 'plus-circle';
        } else if (route.name === 'News') {
          iconName = 'newspaper-o';
        } else if (route.name === 'Search') {
          iconName = 'search';
        }

        return <FontAwesome name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ec6e5b',
      tabBarInactiveTintColor: '#335561',
      headerShown: false,
    })}>
      <Tab.Screen name="Places" component={PlacesScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="AddRecipe" component={AddRecipeScreen} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});