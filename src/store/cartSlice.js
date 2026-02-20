import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../services/cartService";

const initialState = {
  items: [],
  loading: false,
  error: null,
  msg: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      return await cartService.addToCart(productId, quantity);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (productId, { rejectWithValue }) => {
    try {
      return await cartService.removeFromCart(productId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
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
      state.msg = null;
    },
    clearCartError(state) {
      state.error = null;
    },
    clearCartMsg: (state) => {
      state.msg = null;
    },
  },
  extraReducers: (builder) => {
    const fulfilled = (state, action) => {
      state.loading = false;
      state.items = Array.isArray(action.payload.items)
        ? action.payload.items
        : [];
      state.error = null;
      state.msg = action.payload.msg || null;
    };

    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.msg = null;
      })
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load cart";
      })

      .addCase(addToCartAsync.fulfilled, fulfilled)
      .addCase(removeFromCartAsync.fulfilled, fulfilled)
      .addCase(updateQuantityAsync.fulfilled, fulfilled)

      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
