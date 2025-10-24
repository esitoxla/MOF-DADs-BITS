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

const initialState = {
  records: [],
  loading: false,
  error: null,
  editingIndex: null,
  isEditing: false,
  formValues: {},
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    deleteRecord: (state, action) => {
      state.records.splice(action.payload, 1); //This works only if you pass the index (number) of the record you want to delete
    },
    setFormValues: (state, action) => {
      state.formValues = action.payload;
    },
    updateRecord: (state, action) => {
      const { index, updatedRecord } = action.payload;
      state.records[index] = updatedRecord;
      state.isEditing = false;
      state.editingIndex = null;
      state.formValues = {};
    },
    startEditing: (state, action) => {
      state.isEditing = true;
      state.editingIndex = action.payload.index;
      state.formValues = action.payload.record;
    },
    cancelEditing: (state) => {
      state.isEditing = false;
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
      });
  },
});

export const {
  deleteRecord,
  updateRecord,
  startEditing,
  cancelEditing,
  setFormValues,
} = budgetSlice.actions;

export default budgetSlice.reducer;
