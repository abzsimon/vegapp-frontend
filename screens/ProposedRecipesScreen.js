import { StyleSheet, Text, View } from 'react-native';

export default function ProposedRecipesScreen() {
 return (
   <View style={styles.container}>
     <Text>The recipes you proposed</Text>
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