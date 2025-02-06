import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';
  

export default function HomeScreen({ navigation }) {
// declaration des usestate
const [signInModalVisible, setSignInModalVisible] = useState(false);
const [signUpModalVisible, setSignUpModalVisible] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [nickname, setNickname] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

const handleSubmit = () => {
  setSignInModalVisible(false);
  navigation.replace('DrawerNavigator');
};
const SignInModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={signInModalVisible}
      onRequestClose={() => setSignInModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSignInModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const SignUpModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={signUpModalVisible}
      onRequestClose={() => setSignUpModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Nickname"
            value={nickname}
            onChangeText={setNickname}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              // Ajout plus tard de la logique de sign up
              setSignUpModalVisible(false);
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSignUpModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

 return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>VEGAPP</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.mainButton]}
            onPress={() => setSignUpModalVisible(true)}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.mainButton]}
            onPress={() => setSignInModalVisible(true)}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SignInModal />
      <SignUpModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 50,
    },
    buttonContainer: {
      width: '100%',
      alignItems: 'center',
      gap: 20,
    },
    mainButton: {
      width: 150,
      backgroundColor: '#05F2AF',
    },
    button: {
      backgroundColor: '#05F2AF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      width: '100%',
      marginVertical: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 15,
      marginVertical: 8,
    },
    closeButton: {
      marginTop: 15,
    },
    closeButtonText: {
      color: '#666',
      fontSize: 16,
    },
  });