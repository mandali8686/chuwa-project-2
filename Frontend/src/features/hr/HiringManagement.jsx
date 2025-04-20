import React, { useState, useEffect } from "react";
import TokenTable from "../../../components/TokenTable";

const HiringManagement = () => {
  const [email, setEmail] = useState("");
  const [tokens, setTokens] = useState([]);

  const token = localStorage.getItem("token");

  const fetchTokens = async () => {
    const res = await fetch("http://localhost:5400/api/hr/token-history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTokens(data);
  };

  const handleGenerate = async () => {
    if (!email) return alert("Email is required.");

    const res = await fetch("http://localhost:5400/api/hr/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Token created.");
      setEmail("");
      fetchTokens();
    } else {
      alert(data.msg || "Error creating token");
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <div>
      <h2>Hiring Management</h2>

      <input
        type="email"
        placeholder="Employee Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate Token</button>

      <h3>Token History</h3>
      <TokenTable tokens={tokens} />
    </div>
  );
};

export default HiringManagement;
