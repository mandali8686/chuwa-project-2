import React from "react";
import { useNavigate } from "react-router-dom";
import EmployeeList from "./EmployeeList";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">HR Dashboard</h1>

      <div className="space-x-4 mb-8">
        <button
          onClick={() => navigate("/hr/register-token")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Onboarding Token
        </button>

        <button
          onClick={() => navigate("/hr/employees")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          View Employee List
        </button>
      </div>

      {/* 👇 This renders the employee list directly on dashboard */}
      <EmployeeList />
    </div>
  );
};

export default Dashboard;
