import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from "react-redux";

import Header from "../components/header"

export default function PlacesScreen() {
  
 return (
   <View style={styles.container}>
    <Header screenType="Trouvez un commerce !"/>
   </View>  
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
})