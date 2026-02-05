import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchCashRecords = createAsyncThunk(
  "cash/fetchCashReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cash");
      return response.data.data; // your backend returns { success, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cash",
      );
    }
  },
);

export const addCashRecord = createAsyncThunk(
  "cash/addCashRecord",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/cash", formData);
      return response.data.record;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add cash record",
      );
    }
  },
);

export const updateCashRecord = createAsyncThunk(
  "cash/updateCashRecord",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cash/${id}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cash record",
      );
    }
  },
);

//to delete cash
export const deleteCashRecord = createAsyncThunk(
  "cash/deleteCashRecord",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/cash/${id}`);
      return id; // just return the deleted record ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete cash record",
      );
    }
  },
);

export const reviewCashRecord = createAsyncThunk(
  "cash/reviewCashRecord",
  async ({ id, reviewComment }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cash/${id}/review`, {
        reviewComment,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review cash record",
      );
    }
  },
);

//approve cash by a user with role approver
export const approveCashRecord = createAsyncThunk(
  "cash/approveCashRecord",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cash/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve cash record",
      );
    }
  },
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

const cashSlice = createSlice({
  name: "cash",
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
      // fetch all records
      .addCase(fetchCashRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchCashRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //add a record
      .addCase(addCashRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCashRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload); // add new record to list
      })
      .addCase(addCashRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update cash record
      .addCase(updateCashRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      //review revenue
      .addCase(reviewCashRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewCashRecord.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.records.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.records[idx] = action.payload;
      })
      .addCase(reviewCashRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //approve record
      .addCase(approveCashRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      //delete record
      .addCase(deleteCashRecord.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      });
  },
});

export const { startEditing, startReviewing, cancelEditing, setFormValues } =
  cashSlice.actions;

export default cashSlice.reducer;
