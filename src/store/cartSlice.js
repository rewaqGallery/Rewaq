import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../services/cartService";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  cartService.getCart,
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  cartService.clearCart,
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  cartService.removeFromCart,
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      if (quantity <= 0) {
        return await cartService.removeFromCart(productId);
      }
      return await cartService.updateCartItem(productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.error = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const fulfilled = (state, action) => {
      state.loading = false;
      state.items = Array.isArray(action.payload.items)
        ? action.payload.items
        : [];
      state.error = null;
    };
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "An error occurred";
    };

    builder
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, rejected);

    builder
      .addCase(addToCartAsync.pending, pending)
      .addCase(addToCartAsync.fulfilled, fulfilled)
      .addCase(addToCartAsync.rejected, rejected);

    builder
      .addCase(removeFromCartAsync.pending, pending)
      .addCase(removeFromCartAsync.fulfilled, fulfilled)
      .addCase(removeFromCartAsync.rejected, rejected);

    builder
      .addCase(updateQuantityAsync.pending, pending)
      .addCase(updateQuantityAsync.fulfilled, fulfilled)
      .addCase(updateQuantityAsync.rejected, rejected);

    builder
      .addCase(clearCartAsync.pending, pending)
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.error = null;
      })
      .addCase(clearCartAsync.rejected, rejected);
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
