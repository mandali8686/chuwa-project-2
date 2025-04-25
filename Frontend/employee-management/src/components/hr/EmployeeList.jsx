// src/components/hr/EmployeeList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, reviewEmployee } from "../../features/hr/hrSlice";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.hr);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (id, field, value) => {
    dispatch(reviewEmployee({ id, field, value }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>
      {employees.map((emp) => (
        <div key={emp._id} className="border p-4 mb-4">
          <p>
            <strong>Username:</strong> {emp.username}
          </p>
          <p>
            <strong>Email:</strong> {emp.email}
          </p>
          <p>
            <strong>Status:</strong> {emp.onboarding?.status || "N/A"}
          </p>
          <p>
            <strong>Feedback:</strong> {emp.onboarding?.feedback || "N/A"}
          </p>

          <select
            onChange={(e) => handleChange(emp._id, "status", e.target.value)}
            defaultValue={emp.onboarding?.status || "Pending"}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            placeholder="Feedback"
            defaultValue={emp.onboarding?.feedback || ""}
            onBlur={(e) => handleChange(emp._id, "feedback", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
