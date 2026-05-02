import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchReallocationReport = createAsyncThunk(
  "report/fetchReallocationReport",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/reallocationReport/quarterly", {
        params: { year, quarter, organization },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching reallocation report:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching report" },
      );
    }
  },
);

//summary excel download
export const downloadReallocationExcel = createAsyncThunk(
  "report/downloadReallocationExcel",
  async ({ year, quarter, sourceOfFunding, organization }, thunkAPI) => {
    try {
      const response = await api.get("/reallocationReport/quarterly/excel", {
        params: { year, quarter, sourceOfFunding, organization },
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

//summary pdf report
export const downloadReallocationPDF = createAsyncThunk(
  "report/downloadReallocationPDF",
  async ({ year, quarter, sourceOfFunding, organization }, thunkAPI) => {
    try {
      const response = await api.get("/reallocationReport/quarterly/pdf", {
        params: { year, quarter, sourceOfFunding, organization },
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

//detailed
export const fetchDetailedReallocationReport = createAsyncThunk(
  "report/fetchDetailedReallocationReport",
  async ({ year, quarter, organization }, thunkAPI) => {
    try {
      const response = await api.get("/reallocationReport/detailed", {
        params: { year, quarter, organization },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching detailed reallocation:", error);

      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching detailed report" },
      );
    }
  },
);

const reallocationReportSlice = createSlice({
  name: "reallocation",
  initialState: {
    loading: false,
    reportData: [],
    totals: {
      reallocated: 0,
      released: 0,
      expenditure: 0,
      payment: 0,
    },
    error: null,
    detailedRecords: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReallocationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReallocationReport.fulfilled, (state, action) => {
        state.loading = false;

        //  IMPORTANT: match backend response
        state.reportData = action.payload.data || [];
        state.totals = action.payload.totals || {};
      })
      .addCase(fetchReallocationReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch reallocation report";
      })

      //downloading in excel
      .addCase(downloadReallocationExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadReallocationExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadReallocationExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Excel download failed";
      })

      // PDF download
      .addCase(downloadReallocationPDF.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadReallocationPDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadReallocationPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "PDF download failed";
      })

      //detailed
      .addCase(fetchDetailedReallocationReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedReallocationReport.fulfilled, (state, action) => {
        state.loading = false;

        state.detailedRecords = action.payload.records || [];
      })
      .addCase(fetchDetailedReallocationReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch detailed report";
      });
  },
});

export default reallocationReportSlice.reducer;
