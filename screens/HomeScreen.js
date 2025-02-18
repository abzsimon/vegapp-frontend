import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";
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
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function HomeScreen({ navigation }) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async () => {
    setEmailError("");
    setPasswordError("");
    if ( !password.current || !nickname.current) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }
    console.log('Sending:', {
      email: email.current,
      password: password.current,
      username: nickname.current
    });
    
    try {
      const response = await fetch("http://192.168.1.68:3000/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: nickname.current, password: password.current }),
      });

      const data = await response.json();

      if (data.result) {
        dispatch(
          setUser({
            token: data.token,
            email: data.current,
            username: nickname.current,
            favrecipes: data.favrecipes || [],
            favshops: data.favshops || [],
            regime: data.regime || [],
          })
        );
        setSignInModalVisible(false);
        navigation.replace("DrawerNavigator");
      } else {
        // Gérer l'erreur de connexion
        console.log("Erreur de connexion:", data.error);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion");
    }
  };

  const handleSignUp = async () => {
    setEmailError("");
    setPasswordError("");
    if (!email.current || !password.current || !nickname.current) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return;
    }
    if (!EMAIL_REGEX.test(email.current)) {
      Alert.alert("Erreur", "Email invalide");
      setEmailError("Format d'email invalide");
      return;
    }

    if (!password.current || password.current.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      setPasswordError("Mot de passe trop court");
      return;
    }

    if (!nickname.current) {
      Alert.alert("Erreur", "Veuillez entrer un nom d'utilisateur");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.68:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.current,
          password: password.current,
          username: nickname.current,
        }),
      });

      const data = await response.json();

      if (data.result) {
        dispatch(
          setUser({
            token: data.token,
            email: email.current,
            username: nickname.current,
            favrecipes: [],
            favshops: [],
            regime: [],
          })
        );
        setSignUpModalVisible(false);
        navigation.replace("DrawerNavigator");
      } else {
        console.log("Erreur d'inscription:", data.error);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de l'inscription");
    }
  };
  // declaration des usestate
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const email = useRef("");
  const password = useRef("");
  const dispatch = useDispatch();
  const nickname = useRef("");

  useEffect(() => {
    console.log("Sign In Modal Visible:", signInModalVisible);
  }, [signInModalVisible]);

  // Surveillance du clavier pour détecter un comportement anormal
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        console.log("Clavier fermé");
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const SignInModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={signInModalVisible}
      onRequestClose={() => setSignInModalVisible(false)}
    >
      <TouchableWithoutFeedback
        accessible={false}
        //keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sign In</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="grey"
              //value={email}
              defaultValue={nickname.current}
              onChangeText={(text) => (nickname.current = text)}
              //onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="grey"
              defaultValue={password.current}
              onChangeText={(text) => (password.current = text)}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
      </TouchableWithoutFeedback>
    </Modal>
  );

  function SignUpModal({   
    isOpen, 
    onRequestClose, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    nickname, 
    setNickname,
   }) {
 
    const [localConfirmPassword, setLocalConfirmPassword] = useState("");
    //gestion de l'affichage de l'erreur dans un etat independant pour avoir en temps réel
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const handlePasswordConfirmation = (text) => {
      setLocalConfirmPassword(text);
      if (text !== password.current) {
        setConfirmPasswordError("Les mots de passe ne correspondent pas");
      } else {
        setConfirmPasswordError("");
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => onRequestClose()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Nickname"
              defaultValue={nickname.current}
              onChangeText={(text) => nickname.current = text}
              placeholderTextColor="grey"
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email"
              defaultValue={email.current}
              onChangeText={(text) => {
                email.current = text;
                if (EMAIL_REGEX.test(text)) {
                  setEmailError("");
                }
              }}
              autoCapitalize="none"
              placeholderTextColor="grey"
            />
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Password"
              defaultValue={password.current}
              onChangeText={(text) => {
                password.current = text;
                if (text.length >= 6) {
                  setPasswordError("");
                }
                if (localConfirmPassword && text !== localConfirmPassword) {
                  setConfirmPasswordError("Les mots de passe ne correspondent pas");
                } else {
                  setConfirmPasswordError("");
                }
              }}
              secureTextEntry
              placeholderTextColor="grey"
            />
             {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={localConfirmPassword}
              onChangeText={handlePasswordConfirmation}
              secureTextEntry
              placeholderTextColor="grey"
            />
             {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (password.current === localConfirmPassword) {
                  await handleSignUp();
                  onRequestClose();
                } else {setConfirmPasswordError("Les mots de passe ne correspondent pas");
                Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
                }
              }}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onRequestClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

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
      <SignUpModal
        isOpen={signUpModalVisible}
        onRequestClose={() => setSignUpModalVisible(false)}
        email={email}
        setEmail={(text) => (email.current = text)}
        password={password}
        setPassword={(text) => (password.current = text)}
        nickname={nickname}
        setNickname={(text) => (nickname.current = text)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  mainButton: {
    width: 150,
    backgroundColor: "#05F2AF",
  },
  button: {
    backgroundColor: "#05F2AF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
    alignSelf: 'flex-start',
    paddingLeft: 5,
  },
});
