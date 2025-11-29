import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchRevenues = createAsyncThunk(
  "revenue/fetchRevenues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/revenue");
      return response.data.data; // your backend returns { success, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch revenues"
      );
    }
  }
);

export const addRevenue = createAsyncThunk(
  "revenue/addRevenues",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/revenue", formData);
      return response.data.revenue;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add revenue"
      );
    }
  }
);

const initialState = {
  records: [],
  loading: false,
  error: null,
  editingIndex: null,
  isEditing: false,
  isReviewing: false,
  formValues: {},
};

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    startEditing: (state, action) => {
      state.isEditing = true;
      state.isReviewing = false;
      state.editingIndex = action.payload.index;
      state.formValues = action.payload.record;
    },
    startReviewing: (state, action) => {
      state.isReviewing = true;
      state.isEditing = false;
      state.formValues = action.payload.record;
      state.editingIndex = action.payload.index;
    },
    cancelEditing: (state) => {
      state.isEditing = false;
      state.isReviewing = false;
      state.editingIndex = null;
      state.formValues = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRevenues
      .addCase(fetchRevenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenues.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchRevenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addExpenditure
      .addCase(addRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload); // add new record to list
      })
      .addCase(addRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  startEditing,
  startReviewing,
  cancelEditing,
  setFormValues
} = revenueSlice.actions;

export default revenueSlice.reducer;
