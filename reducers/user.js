import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  email: "",
  username: "",
  favrecipes: [],
  favshops: [],
  regime: [],
  ingredients: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logoutUser: () => initialState,
    addRecipe: (state, action) => {
      state.favrecipes.push(action.payload)
    },
    removeRecipe: (state, action) => {
      state.favrecipes = state.favrecipes.filter(e => e !== action.payload);
    },
    addIngredient: (state, action) => {
      state.ingredients.push(action.payload)
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(e => e.id !== action.payload.id);
    },    
    addShop: (state, action) => {
      state.favshops.push(action.payload)
    },
    removeShop: (state, action) => {
      state.favshops = state.favshops.filter(e => e !== action.payload)
    },
    addDiet: (state, action) => {
      if (!state.regime.includes(action.payload)) {
        state.regime.push(action.payload)
      }
    },
    removeDiet: (state, action) => {
      state.regime = state.regime.filter(e => e !== action.payload)
    },
  },
});

export const {
  setUser,
  logoutUser,
  addRecipe,
  removeRecipe,
  addIngredient,
  removeIngredient,
  addShop,
  removeShop,
  addDiet,
  removeDiet,
} = userSlice.actions;

export default userSlice.reducer;
