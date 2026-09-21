import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

// Async thunk for fetching the quarterly report
export const fetchNaturalAccountQuarterlyReport = createAsyncThunk(
  "naturalAccount/fetchQuarterlyReport",
  async ({ year, quarter, sourceOfFunding, organization, status = "ALL" }, thunkAPI) => {
    try {
      const response = await api.get("/naturalAccount/quarterly", {
        params: { year, quarter, sourceOfFunding, organization, status },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching report" },
      );
    }
  },
);

export const downloadNaturalAccountExcel = createAsyncThunk(
  "naturalAccount/downloadQuarterlyExcel",
  async ({ year, quarter, sourceOfFunding, organization, status = "ALL" }, thunkAPI) => {
    try {
      const response = await api.get("/naturalAccount/quarterly/excel", {
        params: { year, quarter, sourceOfFunding, organization, status },
        responseType: "blob", // IMPORTANT for Excel files
      });

      // Create file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Quarterly_Report_${year}_Q${quarter}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error("Excel download failed:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Excel download failed" },
      );
    }
  },
);

export const downloadNaturalAccountPDF = createAsyncThunk(
  "naturalAccount/downloadQuarterlyPDF",
  async ({ year, quarter, sourceOfFunding, organization, status = "ALL" }, thunkAPI) => {
    try {
      const response = await api.get("/naturalAccount/quarterly/pdf", {
        params: { year, quarter, sourceOfFunding, organization, status },
        responseType: "blob", // IMPORTANT for PDF files
      });

      // Create PDF file download
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
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
      // NEVER return a Blob
      return thunkAPI.rejectWithValue({
        message:
          error.response?.status === 500
            ? "Server failed to generate PDF"
            : "PDF download failed",
      });
    }
  },
);


const naturalAccountSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    error: null,
    // Summary natural account
    reportData: [],
    totals: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNaturalAccountQuarterlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNaturalAccountQuarterlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload.report || [];
        state.totals = action.payload.totals || {};
      })
      .addCase(fetchNaturalAccountQuarterlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      //downloading in excel
      .addCase(downloadNaturalAccountExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadNaturalAccountExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadNaturalAccountExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Excel download failed";
      })

      // PDF download
      .addCase(downloadNaturalAccountPDF.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadNaturalAccountPDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadNaturalAccountPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "PDF download failed";
      });
  },
});


export default naturalAccountSlice.reducer;