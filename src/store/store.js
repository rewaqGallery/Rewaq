import { configureStore } from "@reduxjs/toolkit";
import favouritesReducer from "./favouritesSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    favourites: favouritesReducer,
    cart: cartReducer,
  },
});
