import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { Callout } from "react-native-maps";

const CustomCallout = ({ marker }) => {
  return (
    <Callout tooltip>
      <View>
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              {marker.name}
            </Text>
            <Text>{marker.categories}</Text>
            <Text>{marker.sites}</Text>
            <Text>{marker.adress}</Text>
            <Text>{marker.cp}</Text>
            <Text>{marker.sites}</Text>
          </View>
        </View>
      </View>
    </Callout>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: Dimensions.get("window").width * 0.8,
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  triangle: {
    left: (Dimensions.get("window").width * 0.8) / 2 - 10,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderTopWidth: 20,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: "black",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
});

export default CustomCallout;
