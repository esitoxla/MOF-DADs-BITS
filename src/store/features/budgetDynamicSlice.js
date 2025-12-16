import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// Fetch natural accounts
export const fetchNaturalAccounts = createAsyncThunk(
  "budget/fetchNaturalAccounts",
  async ({ eco, fund }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/budget/natural-accounts?eco=${eco}&fund=${fund}`
      );
      return res.data.naturalAccounts;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch accounts"
      );
    }
  }
);


//  Fetch budget values
export const fetchBudgetValues = createAsyncThunk(
  "budget/fetchBudgetValues",
  async ({ eco, fund, account }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/budget/values?eco=${eco}&fund=${fund}&account=${account}`
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch values"
      );
    }
  }
);

const budgetDynamicSlice = createSlice({
  name: "budgetDynamic",
  initialState: {
    naturalAccounts: [],
    budgetValues: {
      appropriation: null,
      allotment: null,
      balance: null,
      totalReleases: null,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNaturalAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNaturalAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.naturalAccounts = action.payload;
      })
      .addCase(fetchNaturalAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchBudgetValues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgetValues.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetValues = action.payload;
      })
      .addCase(fetchBudgetValues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default budgetDynamicSlice.reducer;
