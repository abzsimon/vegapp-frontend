import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null }; // on démarre à vide, parce que le sign-up renvoie un objet qui contient toutes les infos, par exemple :
//   {
//     "result": true,
//     "token": "upmYFdhYS0ev9EOSU7-j110IscerSa5N",
//     "email": "marcel.duplant@youpi.fr",
//     "username": "marcel",
//     "favrecipes": [],
//     "favshops": [],
//     "regime": [],
//     "message": "bonjour"
//   }

// Fonction générique pour envoyer soit une recette, soit un shop, soit un régime
const addItem = (state, action, key) => {
  if (!state.user) return; // pour éviter les erreurs si info user pas stockée
  const exists = state.user[key].includes(action.payload);
  if (!exists) {
    state.user[key].push(action.payload);
  }
};

// Fonction générique pour enlever
const removeItem = (state, action, key) => {
  if (!state.user) return;
  state.user[key] = state.user[key].filter((item) => item !== action.payload);
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // stocker les données utilisateur à la connection
    },
    logoutUser: (state) => {
      state.user = null; // logout (qu'on retrouve dans le drawer)
    },
    addRecipe: (state, action) => addItem(state, action, "favrecipes"),
    removeRecipe: (state, action) => removeItem(state, action, "favrecipes"),
    
    addShop: (state, action) => addItem(state, action, "favshops"),
    removeShop: (state, action) => removeItem(state, action, "favshops"),
    
    addDiet: (state, action) => addItem(state, action, "regime"),
    removeDiet: (state, action) => removeItem(state, action, "regime"),
  },
});

export const { setUser, logoutUser, addRecipe, removeRecipe, addShop, removeShop, addDiet, removeDiet } =
  userSlice.actions;

export default userSlice.reducer;
