import React, { useEffect, useState } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [updates, setUpdates] = useState({});

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5400/api/hr/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (id, field, value) => {
    setUpdates({
      ...updates,
      [id]: {
        ...updates[id],
        [field]: value,
      },
    });
  };

  const handleUpdate = async (id) => {
    const payload = updates[id];
    if (!payload) return;

    try {
      const res = await fetch(`http://localhost:5400/api/hr/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Updated successfully");
        fetchEmployees(); // Refresh data
      } else {
        const err = await res.json();
        alert("Failed to update: " + err.msg);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      {employees.map((emp) => (
        <div
          key={emp._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
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
            onChange={(e) => handleChange(emp._id, "feedback", e.target.value)}
          />

          <button onClick={() => handleUpdate(emp._id)}>Update</button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
