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
  "auth/login",
  async (loginData, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", loginData);
      console.log(res.data.user);
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
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      const res = await api.patch("/auth/profile", data);
      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/change-password", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password change failed"
      );
    }
  }
);

//for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const res = await api.post("/auth/logout");
      return res.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  }
);

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


export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.patch("/auth/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Avatar upload failed"
      );
    }
  }
);


export const removeProfilePic = createAsyncThunk(
  "auth/removeProfilePic",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.patch("/auth/remove-avatar");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to remove profile picture"
      );
    }
  }
);




export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    loading: false,
    error: null,
    passwordChanged: false,
    isAuthenticated: false,
    authChecked: false,
  },

  reducers: {
    setUser: (state, action) => {
      state.authUser = action.payload;
    },
    resetPasswordState: (state) => {
      state.passwordChanged = false;
      state.error = null;
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
        state.authUser = null;
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

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = {
          ...state.authUser,
          ...action.payload,
        };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //this is for change password cases
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChanged = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChanged = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // this is for logout
      .addCase(logoutUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.authUser = null;
        state.error = action.payload;
      })

      //for refresh token
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload;
        state.isAuthenticated = true;
        //This guarantees auth is “checked” exactly once.
        state.authChecked = true; //
      })
      .addCase(refreshSession.rejected, (state) => {
        state.loading = false;
        state.authUser = null;
        state.isAuthenticated = false;
        state.authChecked = true; //
      })

      //this is for profile pic upload
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;

        if (state.authUser) {
          state.authUser = {
            ...state.authUser,
            ...action.payload, 
          };
        }
      })

      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE PROFILE PIC
      .addCase(removeProfilePic.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload.user;
      })
      .addCase(removeProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

export const { setUser, resetPasswordState } = authSlice.actions;
export default authSlice.reducer;
