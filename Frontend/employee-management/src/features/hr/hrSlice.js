import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  makeHTTPGETRequest,
  makeHTTPPOSTRequest,
  makeHTTPPATCHRequest,
  makeHTTPDELETERequest,
} from "../../api/abstract";

export const fetchEmployees = createAsyncThunk(
  "api/hr/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const data = await makeHTTPGETRequest("api/hr/employees");
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const reviewEmployee = createAsyncThunk(
  "api/hr/reviewEmployee",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPATCHRequest(
        `api/hr/employees/${id}`,
        updates
      );
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const generateToken = createAsyncThunk(
  "api/hr/generateToken",
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await makeHTTPPOSTRequest("api/hr/token", { email });
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

export const deleteDocument = createAsyncThunk(
  "api/hr/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await makeHTTPDELETERequest(`api/documents/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const hrSlice = createSlice({
  name: "hr",
  initialState: {
    employees: [],
    documents: [],
    onboardingToken: "",
    loading: false,
    error: null,
  },
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
        state.error = action.payload || action.error.message;
      })
      .addCase(reviewEmployee.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.employees.findIndex((e) => e._id === updated._id);
        if (index !== -1) state.employees[index] = updated;
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.onboardingToken = action.payload.token;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      });
  },
});

export const hrReducer = hrSlice.reducer;
