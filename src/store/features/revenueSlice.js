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
      return response.data.record;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add revenue"
      );
    }
  }
);

//to update revenue record
export const updateRevenue = createAsyncThunk(
  "revenue/updateRevenue",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/revenue/${id}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update revenue"
      );
    }
  }
);

//to delete revenue
export const deleteRevenue = createAsyncThunk(
  "revenue/deleteRevenue",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/revenue/${id}`);
      return id; // just return the deleted record ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete revenue"
      );
    }
  }
);

//review revenue by a user with role reviewer
export const reviewRevenue = createAsyncThunk(
  "revenue/reviewRevenue",
  async ({ id, reviewComment }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/revenue/${id}/review`, {
        reviewComment,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review revenue"
      );
    }
  }
);

//approve revenue by a user with role approver
export const approveRevenue = createAsyncThunk(
  "revenue/approveRevenue",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/revenue/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve revenue"
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

      // addRevenue
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
      })

      //update revenue
      .addCase(updateRevenue.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      //delete revenue
      .addCase(deleteRevenue.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      })

      //review revenue
      .addCase(reviewRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewRevenue.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.records.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.records[idx] = action.payload;
      })
      .addCase(reviewRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //approve revenue
      .addCase(approveRevenue.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export const { startEditing, startReviewing, cancelEditing, setFormValues } =
  revenueSlice.actions;

export default revenueSlice.reducer;
