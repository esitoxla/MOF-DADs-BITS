import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// Async thunk for fetching the quarterly report
export const fetchQuarterlyReport = createAsyncThunk(
  "report/fetchQuarterlyReport",
  async ({ year, quarter, sourceOfFunding }, thunkAPI) => {
    try {
      const response = await api.get("/reports/quarterly", {
        params: { year, quarter, sourceOfFunding },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching report" }
      );
    }
  }
);



const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    reportData: [],
    totals: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuarterlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuarterlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload.report || [];
        state.totals = action.payload.totals || {};
      })
      .addCase(fetchQuarterlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default reportSlice.reducer;