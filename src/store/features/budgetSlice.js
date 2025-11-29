import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchExpenditures = createAsyncThunk(
  "budget/fetchExpenditures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/expense");
      return response.data.data; // your backend returns { success, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch expenditures"
      );
    }
  }
);

export const addExpenditure = createAsyncThunk(
  "budget/addExpenditure",
  async (formData, { rejectWithValue }) => {
    try {
      
      const response = await api.post("/expense", formData);
      return response.data.expenditure;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add expenditure"
      );
    }
  }
);


//to update expenditure record
export const updateExpenditure = createAsyncThunk("budget/updateExpenditure", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await api.put( `/expense/${id}`, formData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update expenditure"
    );
  }
});



//to delete expenditure
export const deleteExpenditure = createAsyncThunk(
  "budget/deleteExpenditure",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/expense/${id}`);
      return id; // just return the deleted record ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete expenditure"
      );
    }
  }
);


//review expenditure by a user with role reviewer
export const reviewExpenditure = createAsyncThunk(
  "budget/reviewExpenditure",
  async ({ id, reviewComment }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/expense/${id}/review`, {
        reviewComment,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review expenditure"
      );
    }
  }
);


//approve expenditure by a user with role approver
export const approveExpenditure = createAsyncThunk(
  "budget/approveExpenditure",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/expense/${id}/approve`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve expenditure"
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

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  //this control the UI state for how the form behaves
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
      // fetchExpenditures
      .addCase(fetchExpenditures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenditures.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchExpenditures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addExpenditure
      .addCase(addExpenditure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpenditure.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload); // add new record to list
      })
      .addCase(addExpenditure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update expenditure
      .addCase(updateExpenditure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })

      //delete expenditure
      .addCase(deleteExpenditure.fulfilled, (state, action) => {
        state.records = state.records.filter((r) => r.id !== action.payload);
      })

      //review expense
      .addCase(reviewExpenditure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewExpenditure.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.records.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.records[idx] = action.payload;
      })
      .addCase(reviewExpenditure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //approve expense
      .addCase(approveExpenditure.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (r) => r.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export const {
  startEditing,
  startReviewing,
  cancelEditing,
  setFormValues,
} = budgetSlice.actions;

export default budgetSlice.reducer;
