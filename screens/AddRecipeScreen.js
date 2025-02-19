import { StyleSheet, Text, View } from 'react-native';
import AddRecipe from '../components/addRecipe'

export default function App() {
 return (
   <View style={styles.container}>
     <AddRecipe></AddRecipe>
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