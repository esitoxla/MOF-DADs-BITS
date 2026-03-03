import { api } from "../../config/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async ({ organization, name }, { rejectWithValue }) => {
    try {
      const response = await api.post("/activity", {
        organization,
        name,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create activity",
      );
    }
  },
);

export const downloadActivityTemplate = createAsyncThunk(
  "activity/downloadTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/activity/template", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "activity_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      return rejectWithValue("Failed to download template");
    }
  },
);

export const bulkUploadActivities = createAsyncThunk(
  "activity/bulkUpload",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/activity/upload-activity-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bulk upload failed",
      );
    }
  },
);

export const getMyActivities = createAsyncThunk(
  "activity/getMyActivities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/activity/my");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activities",
      );
    }
  },
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    loading: false,
    activities: [],
    error: null,
    success: false,
  },
  reducers: {
    resetActivityState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BULK
      .addCase(bulkUploadActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUploadActivities.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(bulkUploadActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get organization specific activities
      builder
        .addCase(getMyActivities.pending, (state) => {
          state.loading = true;
        })
        .addCase(getMyActivities.fulfilled, (state, action) => {
          state.loading = false;
          state.activities = action.payload;
        })
        .addCase(getMyActivities.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export const { resetActivityState } = activitySlice.actions;
export default activitySlice.reducer;
