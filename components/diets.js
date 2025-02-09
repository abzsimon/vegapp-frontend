import { SafeAreaView, StyleSheet, Switch, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addDiet, removeDiet } from "../reducers/user";
import { useEffect } from "react";

function Diets() {
  const dispatch = useDispatch();
  // pour récupérer les régimes stockées dans le reducer
  const diets = useSelector((state) => state.user.regime);
  // pour débugger et vérifier si le reducer se met bien à jour 
  useEffect(() => {
    console.log(diets)
  })

  // une fonction fléchée générique qui prend le type de régime comme paramètre (vegan, vegie, bio ou gluten) et qui l'envoie au reducer en ayant récupéré le contenu de user.regime, pour soit l'ajouter soit le supprimer
  const toggleDiet = (diet) => {
    if (diets.includes(diet)) {
      dispatch(removeDiet(diet)); // supprime si ∃
    } else {
      dispatch(addDiet(diet)); // ajoute si ∄
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* on vient mapper sur un tableau de quatre strings contenant les types de régime pour générer quatre couples switch/texte qui active/desactive le régime dans le reducer en utilisant la fonction toggleDiet*/}
      {["vegan", "veggie", "bio", "gluten"].map((diet) => (
        <SafeAreaView key={diet} style={styles.btn}>
          <Text>{diet.charAt(0).toUpperCase() + diet.slice(1)}</Text>
          <Switch
            style={styles.toggle}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={diets.includes(diet) ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleDiet(diet)} // on toggle la valeur (on/off) dans le reducer pour tel régime
            value={diets.includes(diet)} // on récupère la valeur (booléenne) depuis redux, on/off pour tel régime
          />
        </SafeAreaView>
      ))}
    </SafeAreaView>
  );
}

export default Diets;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
