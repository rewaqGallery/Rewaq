import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favouritesService from "../services/favouritesService";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  favouritesService.getFavourites,
);

export const addFavouriteAsync = createAsyncThunk(
  "favourites/addFavouriteAsync",
  favouritesService.addFavourite,
);

export const removeFavouriteAsync = createAsyncThunk(
  "favourites/removeFavouriteAsync",
  favouritesService.removeFavourite,
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clearFavourites(state) {
      state.items = [];
      state.error = null;
    },
    clearFavouritesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch favourites";
      });

    builder
      .addCase(addFavouriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavouriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; //server return all products
        state.error = null;
      })
      .addCase(addFavouriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add favourite";
      });

    builder
      .addCase(removeFavouriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavouriteAsync.fulfilled, (state, action) => {
        state.loading = false;

        state.items = state.items.filter((item) => {
          return item._id !== action.payload;
        });
        state.error = null;
      })
      .addCase(removeFavouriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove favourite";
      });
  },
});

export const { clearFavourites, clearFavouritesError } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;
