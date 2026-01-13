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



export const downloadQuarterlyExcel = createAsyncThunk(
  "report/downloadQuarterlyExcel",
  async ({ year, quarter, sourceOfFunding }, thunkAPI) => {
    try {
      const response = await api.get("/reports/quarterly/excel", {
        params: { year, quarter, sourceOfFunding },
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




export const downloadQuarterlyPDF = createAsyncThunk(
  "report/downloadQuarterlyPDF",
  async ({ year, quarter, sourceOfFunding }, thunkAPI) => {
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
      // NEVER return a Blob
      return thunkAPI.rejectWithValue({
        message:
          error.response?.status === 500
            ? "Server failed to generate PDF"
            : "PDF download failed",
      });
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
      })

      //downloading in excel
      .addCase(downloadQuarterlyExcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadQuarterlyExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadQuarterlyExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Excel download failed";
      })

      // PDF download
      .addCase(downloadQuarterlyPDF.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadQuarterlyPDF.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadQuarterlyPDF.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "PDF download failed";
      });

  },
});

export default reportSlice.reducer;