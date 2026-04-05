import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favouritesService from "../services/favouritesService";

const initialState = {
  ids: [],
  products: [],
  loading: false,
  productsLoading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await favouritesService.getFavourites();
      return res.ids || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchFavouriteProducts = createAsyncThunk(
  "favourites/fetchFavouriteProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await favouritesService.getFavourites();
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
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
      state.products = [];
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
        state.ids = action.payload;
        state.error = null;
      })
      .addCase(fetchFavourites.rejected, rejected);

    builder
      .addCase(fetchFavouriteProducts.pending, (state) => {
        state.productsLoading = true;
      })
      .addCase(fetchFavouriteProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchFavouriteProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.payload || "Failed to fetch favourite products";
      });

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
        state.products = state.products.filter(
          (p) => String(p._id) !== String(id),
        );

        state.error = null;
      })
      .addCase(removeFavouriteAsync.rejected, rejected);
  },
});

export const { clearFavourites, clearFavouritesError } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;
