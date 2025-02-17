import { StyleSheet, Text, View } from 'react-native';
import Search from "../components/search";

export default function App() {
 return (
   <View style={styles.container}>
     <Search></Search>
   </View>  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
})