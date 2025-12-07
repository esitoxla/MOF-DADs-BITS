import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// Async thunk for fetching the quarterly report
export const fetchQuarterlyRevenueReport = createAsyncThunk(
  "revenueReport/fetchQuarterlyReport",
  async ({ year, quarter }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/quarterly", {
        params: { year, quarter },
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
  "report/downloadQuarterlyExcel",
  async ({ year, quarter }, thunkAPI) => {
    try {
      const response = await api.get("/revenueReport/quarterly/excel", {
        params: { year, quarter },
        responseType: "blob", // IMPORTANT for Excel files
      });

      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Quarterly_Report_${year}_Q${quarter}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error("Excel download failed:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Excel download failed" }
      );
    }
  }
);


export const downloadQuarterlyRevenuePDF = createAsyncThunk(
  "report/downloadQuarterlyPDF",
  async ({ year, quarter }, thunkAPI) => {
    try {
      const response = await api.get("/reports/quarterly/pdf", {
        params: { year, quarter, sourceOfFunding },
        responseType: "blob", // IMPORTANT for PDF files
      });

      // Create PDF file download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Quarterly_Report_${year}_Q${quarter}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error("PDF download failed:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "PDF download failed" }
      );
    }
  }
);


const revenueReportSlice = createSlice({
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
        .addCase(fetchQuarterlyRevenueReport.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchQuarterlyRevenueReport.fulfilled, (state, action) => {
          state.loading = false;
          state.reportData = action.payload.report || [];
          state.totals = action.payload.totals || {};
        })
        .addCase(fetchQuarterlyRevenueReport.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        })

        //downloading in excel
        .addCase(downloadQuarterlyRevenueExcel.pending, (state) => {
          state.loading = true;
        })
        .addCase(downloadQuarterlyRevenueExcel.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(downloadQuarterlyRevenueExcel.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Excel download failed";
        })

        // PDF download
        .addCase(downloadQuarterlyRevenuePDF.pending, (state) => {
          state.loading = true;
        })
        .addCase(downloadQuarterlyRevenuePDF.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(downloadQuarterlyRevenuePDF.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "PDF download failed";
        });
  
    },
  });

  export default revenueReportSlice.reducer;