import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// FETCH
export const fetchReallocations = createAsyncThunk(
  "reallocation/fetchReallocations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/reallocation");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reallocations",
      );
    }
  },
);

// ADD
export const addReallocation = createAsyncThunk(
  "reallocation/addReallocation",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reallocation", formData);
      return response.data.reallocation;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add reallocation",
      );
    }
  },
);

// UPDATE
export const updateReallocation = createAsyncThunk(
  "reallocation/updateReallocation",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/reallocation/${id}`, formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update reallocation",
      );
    }
  },
);

// DELETE
export const deleteReallocation = createAsyncThunk(
  "reallocation/deleteReallocation",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reallocation/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete reallocation",
      );
    }
  },
);

// REVIEW
export const reviewReallocation = createAsyncThunk(
  "reallocation/reviewReallocation",
  async ({ id, reviewComment }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reallocation/${id}/review`, {
        reviewComment,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review reallocation",
      );
    }
  },
);

// APPROVE
export const approveReallocation = createAsyncThunk(
  "reallocation/approveReallocation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/reallocation/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve reallocation",
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

const reallocationSlice = createSlice({
  name: "reallocation",
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
      state.editingIndex = action.payload.index;
      state.formValues = action.payload.record;
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
      // FETCH
      .addCase(fetchReallocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReallocations.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchReallocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addReallocation.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateReallocation.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteReallocation.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      })

      // REVIEW
      .addCase(reviewReallocation.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      // APPROVE
      .addCase(approveReallocation.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export const { startEditing, startReviewing, cancelEditing, setFormValues } =
  reallocationSlice.actions;

export default reallocationSlice.reducer;