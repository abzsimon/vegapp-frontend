import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
// On importe les outils de Redux pour gérer notre state global
import { useDispatch, useSelector } from 'react-redux';
import { addDiet, removeDiet } from '../reducers/user';

// On définit nos régimes alimentaires dans une constante pour pouvoir les réutiliser facilement
const REGIMES = ['Végé', 'Bio', 'Sans gluten', 'Vegan'];

// Notre composant principal qui reçoit une prop pour notifier les changements
export default function Diet({ onRegimeChange }) {
  // On initialise dispatch pour pouvoir envoyer des actions à Redux
  const dispatch = useDispatch();
  // On récupère les régimes de l'utilisateur depuis le state Redux
  const userDiets = useSelector((state) => state.user.regime);

  // Fonction qui gère le clic sur un régime alimentaire
  const toggleDiet = (regime) => {
    // Si le régime est déjà sélectionné, on le retire
    if (userDiets.includes(regime)) {
      dispatch(removeDiet(regime));
    } else {
      // Sinon, on l'ajoute
      dispatch(addDiet(regime));
    }
    // On notifie le composant parent qu'il y a eu un changement (pour la recherche)
    if (onRegimeChange) {
      onRegimeChange(regime);
    }
  };

  // La partie visuelle de notre composant
  return (
    <View style={styles.regimeContainer}>
      {/* On map sur notre tableau de régimes pour créer un bouton pour chacun */}
      {REGIMES.map((regime) => (
        <TouchableOpacity
          key={regime} // Clé unique pour React
          style={[
            styles.regimeButton,
            // Si le régime est sélectionné, on ajoute un style spécial
            userDiets.includes(regime) && styles.regimeButtonSelected,
          ]}
          onPress={() => toggleDiet(regime)}
        >
          <Text style={styles.regimeText}>{regime}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// Nos styles pour le composant
const styles = StyleSheet.create({
  regimeContainer: {
    flexDirection: 'row', // Les boutons sont alignés horizontalement
    flexWrap: 'wrap',    // Ils passent à la ligne si pas assez de place
    marginBottom: 20,
    gap: 10,             // Espace entre les boutons
  },
  regimeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,    // Pour avoir des boutons arrondis
    borderWidth: 1,
    borderColor: '#F28DEB',
    backgroundColor: '#FFFFFF',
  },
  regimeButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,      // Bordure plus épaisse quand sélectionné
  },
  regimeText: {
    color: '#F28DEB',    // Couleur du texte en rose
  },
});