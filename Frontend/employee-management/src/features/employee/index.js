import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeHTTPPOSTRequest, makeHTTPPUTRequest, makeHTTPGETRequest } from '../../api/abstract';

const initialState = {
  token: null,
  loading: false,
  currentUser: null,
  isAuthenticated: false,
  error: null
};

export const createUserAsync = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPOSTRequest('api/users', userData);
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPOSTRequest('api/auth/login', { username, password });
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await makeHTTPGETRequest(`api/employees/${userId}`);
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ userId, newPassword }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPUTRequest(`api/users/${userId}`, { password: newPassword });
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const sendResetEmail = createAsyncThunk(
  'user/sendResetEmail',
  async (email, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPOSTRequest('/api/users/reset-password', { email });
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearUser: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('userId', action.payload.userId);  
        state.token = action.payload.token;
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // Replace currentUser with the fetched data
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });      
  }
});

export const userReducer = userSlice.reducer;
export const { setCurrentUser, clearUser, clearError } = userSlice.actions;
