// src/features/hr/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeHTTPGETRequest, makeHTTPPATCHRequest } from "../../api/abstract";

const initialState = {
  employees: [],
  documents: [],
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  "hr/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeHTTPGETRequest("api/hr/employees");
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchDocuments = createAsyncThunk(
  "hr/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeHTTPGETRequest("api/documents");
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const reviewDocument = createAsyncThunk(
  "hr/reviewDocument",
  async ({ id, status, feedback }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPATCHRequest(`api/documents/${id}`, {
        status,
        feedback,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(reviewDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(
          (doc) => doc._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      });
  },
});

export const hrReducer = hrSlice.reducer;
