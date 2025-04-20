import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./features/hr/Login";
import HiringManagement from "./features/hr/HiringManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/hr/hiring" element={<HiringManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
