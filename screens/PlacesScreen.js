import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import MapView from "react-native-maps";
import { Dimensions } from "react-native";
import * as Location from 'expo-location';

import Header from "../components/header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlacesScreen() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location)
      }
    })();
   }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header screenType="Trouvez un commerce !" />
      {location ? (<MapView
      style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      ></MapView> ) : (
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*0.6,
    marginVertical : 10,
  },
});
