import { api } from "../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", registerData);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

//for login
export const loginUser = createAsyncThunk(
  "login",
  async (loginData, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", loginData);
      // console.log(res.data.user);
      return res.data.user;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  }
);

//for getting a user details
export const getUser = createAsyncThunk("getUser", async (_, thunkAPI) => {
  try {
    const res = await api.get("/auth/me");
    // console.log(res.data.user);
    return thunkAPI.fulfillWithValue(res.data.user);
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return thunkAPI.rejectWithValue(null);
    }
    return thunkAPI.rejectWithValue(null);
  }
});

export const changePassword = createAsyncThunk(
  "changePass",
  async (CData, thunkAPI) => {
    try {
      const res = await api.post("/auth/change-password", CData);
      // console.log(res.data);
      return thunkAPI.fulfillWithValue(res.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(null);
      }
      return thunkAPI.rejectWithValue(null);
    }
  }
);

//for logout
export const logoutUser = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data.message) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
});

export const refreshSession = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/refresh");
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Session refresh failed"
      );
    }
  }
);



export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })

      //this is for login
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.authUser = null;
        state.error = action.payload;
      })

      // this is for loaduser cases
      .addCase(getUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.authUser = null;
        state.error = action.payload;
      })

      //this is for change password cases
      .addCase(changePassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.message = null;
        state.error = action.payload;
      })

      // this is for logout
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.authUser = null;
        state.error = action.payload;
      })

      //for refresh token
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshSession.rejected, (state) => {
        state.authUser = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
