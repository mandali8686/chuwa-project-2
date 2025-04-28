import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Application from "./components/Application/Application";
import Register from "./components/SignIn/Register";
import SignIn from "./components/SignIn/SignIn";
import PersonalInformation from "./components/PersonInfo/PersonInfo";
import Dashboard from "./components/hr/Dashboard";
import EmployeeList from "./components/hr/EmployeeList";
import DocumentReview from "./components/hr/DocumentReview";
import RegisterToken from "./components/hr/RegisterToken";
import VisaDocuments from "./components/PersonInfo/VisaDocument";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/application/:id" element={<Application />} />
        <Route path="/register/:token" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/person-info/:id" element={<PersonalInformation />} />
          <Route path="/visa-status/:id" element={<VisaDocuments />} />
          <Route path="/hr/dashboard" element={<Dashboard />} />
          <Route path="/hr/employees" element={<EmployeeList />} />
          <Route path="/hr/documents" element={<DocumentReview />} />
          <Route path="/hr/register-token" element={<RegisterToken />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
