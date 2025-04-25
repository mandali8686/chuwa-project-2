import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeHTTPGETRequest, makeHTTPPOSTRequest } from "../../api/abstract";


export const fetchEmployees = createAsyncThunk(
  "api/hr/fetchEmployees",
  async () => {
    const res = await fetch("http://localhost:5400/api/hr/employees");
    if (!res.ok) throw new Error("Failed to fetch employees");
    return await res.json();
  }
);

export const reviewEmployee = createAsyncThunk(
  "api/hr/reviewEmployee",
  async ({ id, updates }) => {
    const res = await fetch(`http://localhost:5400/api/hr/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to review employee");
    return await res.json();
  }
);

export const generateToken = createAsyncThunk(
  "api/hr/generateToken", async ({ email }, { rejectWithValue }) => {
    try {
      console.log('Useremail', email);
      const data = await makeHTTPPOSTRequest('api/hr/token', { email });
      return data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const fetchDocuments = createAsyncThunk(
  "hr/fetchDocuments",
  async () => {
    const res = await fetch("http://localhost:5400/api/documents");
    if (!res.ok) throw new Error("Failed to fetch documents");
    return await res.json();
  }
);

export const deleteDocument = createAsyncThunk(
  "api/hr/deleteDocument",
  async (id) => {
    const res = await fetch(`http://localhost:5400/api/documents/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return id;
  }
);

// --------------------- Slice ---------------------
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
      // Fetch Employees
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
        state.error = action.error.message;
      })

      // Review Employee
      .addCase(reviewEmployee.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.employees.findIndex((e) => e._id === updated._id);
        if (index !== -1) state.employees[index] = updated;
      })

      // Generate Token
      .addCase(generateToken.fulfilled, (state, action) => {
        state.onboardingToken = action.payload.token;
      })

      // Fetch Documents
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.documents = action.payload;
      })

      // Delete Document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      });
  },
});

export const hrReducer= hrSlice.reducer;
