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
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to download template"
      );
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
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to save record"
      );
    }
  }
);

export const fetchAllLoadedData = createAsyncThunk(
  "appropriation/getLoadedData",
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/loadedData");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Loaded Data"
      );
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

      const res = await api.post("/loadedData/upload-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Excel upload failed"
      );
    }
  }
);


//to update loadedData record
export const updateLoadedData = createAsyncThunk(
  "loadedData/updateLoadedData",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/loadedData/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update loaded data"
      );
    }
  }
);



//to delete expenditure
export const deleteLoadedData = createAsyncThunk(
  "loadedData/deleteLoadedData",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/loadedData/${id}`);
      return id; // just return the deleted record ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete loaded data"
      );
    }
  }
);

const appropriationSlice = createSlice({
  name: "appropriation",
  initialState: {
    loading: false,
    error: null,
    records: [],
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
      // GET ALL LOADED DATA
      // ----------------------
      .addCase(fetchAllLoadedData.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchAllLoadedData.fulfilled, (state, action) => {
        (state.loading = false), (state.records = action.payload);
      })
      .addCase(fetchAllLoadedData.rejected, (state, action) => {
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
      })

      // ----------------------
      // UPDATE LOADED DATA
      // ----------------------
      .addCase(updateLoadedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLoadedData.fulfilled, (state, action) => {
        state.loading = false;

        const updatedRecord = action.payload;

        const index = state.records.findIndex(
          (record) => record.id === updatedRecord.id
        );

        if (index !== -1) {
          state.records[index] = updatedRecord;
        }
      })
      .addCase(updateLoadedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------------------
      // DELETE LOADED DATA
      // ----------------------
      .addCase(deleteLoadedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLoadedData.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload;

        state.records = state.records.filter(
          (record) => record.id !== deletedId
        );
      })
      .addCase(deleteLoadedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { resetUploadState } = appropriationSlice.actions;
export default appropriationSlice.reducer;
