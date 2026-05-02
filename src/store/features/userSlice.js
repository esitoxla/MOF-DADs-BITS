import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get("/users", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

//add User
export const addUser = createAsyncThunk(
  "user/addUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users", payload);
      return data.user; // backend sends { qrCode }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id; // just return the deleted record ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete loaded data",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    totalUsers: 0,
    totalPages: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        ((state.loading = true), (state.error = null));
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;

        state.totalUsers = action.payload.totalUsers; 
        state.totalPages = action.payload.totalPages; 
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //add
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload); // add new user to top
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UPDATE USER

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const updatedRecord = action.payload;

        const index = state.users.findIndex(
          (user) => user.id === updatedRecord.id,
        );

        if (index !== -1) {
          state.users[index] = updatedRecord;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //DELETE
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload;

        state.users = state.users.filter((user) => user.id !== deletedId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
