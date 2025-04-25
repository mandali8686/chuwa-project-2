import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // optional, unused for now
import Layout from "./components/Layout";
import Application from "./components/Application/Application";
import Register from "./components/SignIn/Register";

import SignIn from "./components/SignIn/SignIn";
import PersonalInformation from "./components/PersonInfo/PersonInfo";

// HR Components
import Dashboard from "./components/hr/Dashboard";
import EmployeeList from "./components/hr/EmployeeList";
import DocumentReview from "./components/hr/DocumentReview";
import RegisterToken from "./components/hr/RegisterToken";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* General Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/person-info" element={<PersonalInformation />} />
        <Route path="/application" element={<Application />} />
        <Route path="/register/:token" element={<Register />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/hr/register-token" element={<RegisterToken />} />

        {/* HR Routes */}
        <Route path="/hr/dashboard" element={<Dashboard />} />
        <Route path="/hr/employees" element={<EmployeeList />} />
        <Route path="/hr/documents" element={<DocumentReview />} />
        <Route path="/hr/register-token" element={<RegisterToken />} />
      </Route>
    </Routes>
  );
}

export default App;
