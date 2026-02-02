import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      console.log("fetch orders calling...");
      const token = localStorage.getItem("adminToken");

      const response = await axios.get("https://api.middaybox.com/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    activeTab: "active",
    allOrders: {},
    loading: false,
    error: null,

    filters: {
      status: "active",
      search: "",
      school: "",
      parent: "",
      startDate: "",
      endDate: "",
    },
  },

  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.filters.status = action.payload === "active" ? "active" : "completed";
    },

    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        console.log(action.payload,'action.payload');
        
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveTab, updateFilters } = ordersSlice.actions;
export default ordersSlice.reducer;
