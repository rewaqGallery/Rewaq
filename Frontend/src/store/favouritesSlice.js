import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favouritesService from "../services/favouritesService";

const initialState = {
  ids: [],
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
      state.ids = [];
      state.error = null;
    },
    clearFavouritesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    };

    builder
      .addCase(fetchFavourites.pending, pending)
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload.ids;
        state.error = null;
      })
      .addCase(fetchFavourites.rejected, rejected);

    builder
      .addCase(addFavouriteAsync.pending, pending)
      .addCase(addFavouriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        if (!state.ids.includes(id)) {
          state.ids.unshift(id);
        }
        state.error = null;
      })
      .addCase(addFavouriteAsync.rejected, rejected);

    builder
      .addCase(removeFavouriteAsync.pending, pending)
      .addCase(removeFavouriteAsync.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;
        state.ids = state.ids.filter((i) => i !== id);

        state.error = null;
      })
      .addCase(removeFavouriteAsync.rejected, rejected);
  },
});

export const { clearFavourites, clearFavouritesError } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;
