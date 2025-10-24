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
      console.log(res.data.user);
      return res.data.user;
    } catch (error) {
      console.log(error)
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
    console.log(res);
    return thunkAPI.fulfillWithValue(res.data.user);
  } catch (error) {
    if (error.response && error.response.data.message) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
});


export const changePassword = createAsyncThunk(
  "changePass",
  async (CData, thunkAPI) => {
    try {
      const res = await api.post("/auth/change-password", CData);
      console.log(res.data);
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
    console.log(error)
    if (error.response && error.response.data.message) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
});



const initialState = {
    authUser: null,
    loading: false,
    error: null
}


export const authSlice = createSlice({
  name: "auth",
  initialState,
   reducers: {
    setUser: (state, action) => {
      state.authUser= action.payload;
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
      });
  }
});

export const { setUser } =  authSlice.actions;
export default authSlice.reducer;
