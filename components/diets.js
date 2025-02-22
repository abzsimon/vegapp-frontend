import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addDiet, removeDiet } from '../reducers/user';

// On définit nos régimes alimentaires dans une constante pour pouvoir les réutiliser facilement
const REGIMES = ['Végé', 'Bio', 'Sans gluten', 'Vegan'];

// Notre composant principal qui reçoit une prop pour notifier les changements
export default function Diet({ onRegimeChange, style }) {
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
    <View style={[styles.regimeContainer, style]}>
      {/* On map sur notre tableau de régimes pour créer un bouton pour chacun */}
      {REGIMES.map((regime) => (
        <TouchableOpacity
          key={regime}
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
    flexDirection: 'row', 
    flexWrap: 'wrap',    
    marginBottom: 20,
    gap: 10,             
  },
  regimeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,    
    borderWidth: 1,
    borderColor: '#F28DEB',
    backgroundColor: '#FFFFFF',
  },
  regimeButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,      
  },
  regimeText: {
    color: '#F28DEB',   
  },
});