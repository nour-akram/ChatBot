import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../../../api/config";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        credentials
      );
      const { access_token } = response.data;
      Cookies.set("accessToken", access_token);
      return { access_token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        credentials
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: Cookies.get("accessToken") || null,
    loginStatus: null,
    registerStatus: null,
    loginError: null,
    registerError: null,
  },
  reducers: {
    logout(state) {
      state.accessToken = null;
      
      Cookies.remove("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.loginStatus = "success";
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginError = action.payload;
      })
      ////////////////////////////register//////////////////////
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = "success";
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
