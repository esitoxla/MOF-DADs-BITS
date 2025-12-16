import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../config/axios";


// DOWNLOAD TEMPLATE
export const downloadTemplate = createAsyncThunk(
  "appropriation/downloadTemplate",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/loadedData/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "appropriation_template.xlsx");
      document.body.appendChild(link);
      link.click();

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to download template");
    }
  }
);

// CREATE SINGLE APPROPRIATION RECORD
export const createLoadedData = createAsyncThunk(
  "appropriation/createLoadedData",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/loadedData", payload);
      return res.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to save record");
    }
  }
);

// BULK EXCEL UPLOAD
export const uploadAppropriationExcel = createAsyncThunk(
  "appropriation/uploadAppropriationExcel",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(
        "/loadedData/upload-excel",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Excel upload failed");
    }
  }
);


const appropriationSlice = createSlice({
  name: "appropriation",
  initialState: {
    loading: false,
    error: null,
    uploadResponse: null, // used for both single + bulk results
    downloadStatus: null,
  },

  reducers: {
    resetUploadState: (state) => {
      state.uploadResponse = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ----------------------
      // DOWNLOAD TEMPLATE
      // ----------------------
      .addCase(downloadTemplate.pending, (state) => {
        state.downloadStatus = "loading";
      })
      .addCase(downloadTemplate.fulfilled, (state) => {
        state.downloadStatus = "success";
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.error = action.payload;
      })

      // ----------------------
      // CREATE SINGLE RECORD
      // ----------------------
      .addCase(createLoadedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLoadedData.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadResponse = action.payload;
      })
      .addCase(createLoadedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------------------
      // BULK EXCEL UPLOAD
      // ----------------------
      .addCase(uploadAppropriationExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAppropriationExcel.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadResponse = action.payload;
      })
      .addCase(uploadAppropriationExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUploadState } = appropriationSlice.actions;
export default appropriationSlice.reducer;