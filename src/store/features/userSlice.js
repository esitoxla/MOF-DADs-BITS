import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../config/axios";

export const fetchAllUsers = createAsyncThunk(
  "users/get",
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users");
      return data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch QR codes"
      );
    }
  }
);



//add qrcode
export const addUser = createAsyncThunk(
  "user/addUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users", payload);
      return data.user; // backend sends { qrCode }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        (state.loading = false), (state.users = action.payload);
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
      });
  },
});

export default userSlice.reducer;
