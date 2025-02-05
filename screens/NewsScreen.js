import { StyleSheet, Text, View } from 'react-native';

export default function App() {
 return (
   <View style={styles.container}>
     <Text>News screen</Text>
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