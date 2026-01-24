import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// Async thunk for fetching the quarterly report
export const fetchQuarterlyRevenueReport = createAsyncThunk(
  "revenueReport/fetchQuarterlyReport",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/quarterly", {
        params: { year, quarter, organization },
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


export const downloadQuarterlyRevenueExcel = createAsyncThunk(
  "revenueReport/downloadQuarterlyRevenueExcel",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/quarterly/excel", {
        params: { year, quarter, organization },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Revenue_Report_${year}_Q${quarter}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      
    } catch (error) {
      console.error("Excel download failed:", error);
      
     return thunkAPI.rejectWithValue({
       message: "Excel download failed",
     });
    }
  }
);



export const downloadQuarterlyRevenuePDF = createAsyncThunk(
  "revenueReport/downloadQuarterlyRevenuePDF",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/quarterly/pdf", {
        params: { year, quarter, organization },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Revenue_Report_${year}_Q${quarter}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "PDF download failed" }
      );
    }
  }
);

/* THIS IS FOR DETAILED REPORT */
export const fetchDetailedRevenueReport = createAsyncThunk(
  "revenueReport/fetchDetailedRevenueReport",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/detailed", {
        params: { year, quarter, organization },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch detailed revenue report",
        }
      );
    }
  }
);




const revenueReportSlice = createSlice({
  name: "revenueReport",
  initialState: {
    loading: false,
    reportData: [],
    detailedRecords: [],
    totals: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuarterlyRevenueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuarterlyRevenueReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload.records || [];
        state.totals = action.payload.totals || {};
      })
      .addCase(fetchQuarterlyRevenueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // =======================
      // DETAILED REVENUE
      // =======================
      .addCase(fetchDetailedRevenueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedRevenueReport.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedRecords = action.payload.records || [];
      })
      .addCase(fetchDetailedRevenueReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to load detailed revenue report";
      });
  },
});

  export default revenueReportSlice.reducer;