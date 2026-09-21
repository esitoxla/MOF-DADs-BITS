import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

/* ===============================
   FETCH SUMMARY (CASH POSITION)
================================= */
export const fetchCashPositionReport = createAsyncThunk(
  "cashReport/fetchSummary",
  async ({ year, quarter, organization, status = "ALL" }, thunkAPI) => {
    try {
      const response = await api.get("/cashReport/quarterly", {
        params: { year, quarter, organization, status },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching cash position" },
      );
    }
  },
);



/* ===============================
   DOWNLOAD EXCEL (CASH POSITION)
================================= */
export const downloadCashPositionExcel = async ({
  year,
  quarter,
  organization,
  status = "ALL",
}) => {
  const response = await api.get("/cashReport/quarterly/excel", {
    params: { year, quarter, organization, status },
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Cash_Position_Q${quarter}_${year}.xlsx`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};



/* ===============================
   DOWNLOAD PDF (CASH POSITION)
================================= */
export const downloadCashPositionPDF = async ({
  year,
  quarter,
  organization,
  status = "ALL",
}) => {
  try {
    const response = await api.get("/cashReport/quarterly/pdf", {
      params: { year, quarter, organization, status },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Cash_Position_Q${quarter}_${year}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

//for the export thunk it does not need a slice because it create blob and trigger download, it does not render anything in the UI or store any thing


/* ===============================
   FETCH DETAILED CASH REPORT
================================= */
export const fetchDetailedCashReport = createAsyncThunk(
  "cashReport/fetchDetailed",
  async ({ year, quarter, organization, status = "ALL" }, thunkAPI) => {
    try {
      const response = await api.get("/cashReport/detailed", {
        params: { year, quarter, organization, status },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching detailed report" },
      );
    }
  },
);


/* ===============================
   INITIAL STATE
================================= */
const initialState = {
  summary: {
    records: [],
    totals: {},
    loading: false,
    error: null,
  },
  detailed: {
    records: [],
    loading: false,
    error: null,
  },
};

/* ===============================
   SLICE
================================= */
const cashReportSlice = createSlice({
  name: "cashReport",
  initialState,
  reducers: {
    clearCashReports: (state) => {
      state.summary = initialState.summary;
      state.detailed = initialState.detailed;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ===== SUMMARY ===== */
      .addCase(fetchCashPositionReport.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchCashPositionReport.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.records = action.payload.records || [];
        state.summary.totals = action.payload.totals || {};
      })
      .addCase(fetchCashPositionReport.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload?.message || "Error occurred";
      })

      /* ===== DETAILED ===== */
      .addCase(fetchDetailedCashReport.pending, (state) => {
        state.detailed.loading = true;
        state.detailed.error = null;
      })
      .addCase(fetchDetailedCashReport.fulfilled, (state, action) => {
        state.detailed.loading = false;
        state.detailed.records = action.payload.records || [];
      })
      .addCase(fetchDetailedCashReport.rejected, (state, action) => {
        state.detailed.loading = false;
        state.detailed.error = action.payload?.message || "Error occurred";
      });
  },
});

export const { clearCashReports } = cashReportSlice.actions;
export default cashReportSlice.reducer;
