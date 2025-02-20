import { SafeAreaView, StyleSheet, Text, View } from "react-native";

function Header(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>VEGAPP</Text>
      <Text style={styles.h2}>{props.screenType}</Text>
    </SafeAreaView>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    backgroundColor : "darksalmon",
    fontSize : 40,
  },
  h2: {
    fontSize : 25,
  }
})